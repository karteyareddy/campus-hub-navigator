import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Users,
  Search,
  Wifi,
  Monitor,
  Projector,
  Check,
  Calendar,
  Clock,
  BookOpen
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { parseCSV, TimetableEntry, getOccupiedRooms } from "@/utils/timetableUtils";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timeSlots = [
  "09:00-10:00",
  "10:00-11:00",
  "11:00-12:00",
  "12:00-01:00",
  "01:00-02:00",
  "02:00-03:00",
  "03:00-04:00",
  "04:00-05:00"
];

const Classrooms = () => {
  const [classrooms, setClassrooms] = useState<any[]>([]);
  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterAvailable, setFilterAvailable] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  // Time Selection
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [selectedTime, setSelectedTime] = useState<string>("09:00-10:00");

  useEffect(() => {
    // Auto-select current day/time
    const d = new Date();
    const dayName = days[d.getDay() - 1];
    if (dayName) setSelectedDay(dayName);

    const hour = d.getHours();
    if (hour >= 9 && hour <= 16) {
      const start = hour > 12 ? hour - 12 : hour;
      const searchStr = `${start.toString().padStart(2, '0')}:00`;
      const found = timeSlots.find(t => t.startsWith(searchStr));
      if (found) setSelectedTime(found);
    }

    Promise.all([fetchClassrooms(), fetchTimetable()]).then(() => {
      setLoading(false);
    });

    // Subscribe to DB changes
    const channel = supabase
      .channel('schema-db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'classrooms' }, () => {
        fetchClassrooms();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchClassrooms = async () => {
    const { data } = await supabase.from('classrooms').select('*');
    if (data) setClassrooms(data);
  };

  const fetchTimetable = async () => {
    try {
      const files = [
        "23S01_FULL_WEEK_TIMETABLE.csv",
        "23S02_FULL_WEEK_TIMETABLE.csv",
        "23S03_FULL_WEEK_TIMETABLE.csv",
        "23S04_FULL_WEEK_TIMETABLE.csv"
      ];
      let combined: TimetableEntry[] = [];
      for (const file of files) {
        const res = await fetch(`/data/${file}`);
        const text = await res.text();
        const entries = parseCSV(text, file.split('_')[0]);
        combined = [...combined, ...entries];
      }
      setTimetableEntries(combined);
    } catch (e) {
      console.error("Error fetching timetable", e);
      toast.error("Could not load timetable data");
    }
  };

  // Determine availability based on DB + Timetable
  const getClassroomStatus = (roomNo: string) => {
    // 1. Check Timetable Occupancy
    const activeClass = timetableEntries.find(e =>
      e.roomRaw === roomNo &&
      e.day.toLowerCase() === selectedDay.toLowerCase() &&
      e.time === selectedTime
    );

    // 2. Determine "Available"
    // If there is an active class, it is NOT available.
    // If there is NO active class, we respect the DB's manual "is_available" flag if it's set to false (maintenance etc),
    // otherwise it is available.
    // Actually, for "Empty Classroom Finder", if timetable says free, it's likely free unless marked otherwise.
    // Let's assume DB `is_available` is a manual override (e.g. Broken AC).

    const isOccupiedByClass = !!activeClass;

    return {
      isOccupiedByClass,
      activeClass: activeClass ? activeClass : null
    };
  };

  const processedClassrooms = classrooms.map(room => {
    const status = getClassroomStatus(room.room_no);
    // Final availability: Not occupied by class AND Not manually disabled in DB
    const isAvailable = !status.isOccupiedByClass && room.is_available;

    return {
      ...room,
      isRealTimeAvailable: isAvailable,
      currentStatus: status
    };
  });

  const filteredClassrooms = processedClassrooms.filter(room => {
    const matchesSearch = room.room_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.building.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || room.type === filterType;
    const matchesAvailable = filterAvailable === null || room.isRealTimeAvailable === filterAvailable;
    return matchesSearch && matchesType && matchesAvailable;
  });

  const availableCount = processedClassrooms.filter(r => r.isRealTimeAvailable).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-muted-foreground">Loading classrooms and schedules...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in p-2 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Classroom Availability</h1>
          <p className="text-muted-foreground mt-1">Real-time status tracking</p>
        </div>

        {/* Time Selectors */}
        <div className="flex items-center gap-2">
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger className="w-[130px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger className="w-[140px]">
              <Clock className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        <div className="bg-status-available/10 px-4 py-2 rounded-lg flex items-center gap-2 whitespace-nowrap">
          <div className="w-2 h-2 rounded-full bg-status-available animate-pulse" />
          <span className="text-sm font-medium text-status-available">
            {availableCount} Rooms Free
          </span>
        </div>

        <div className="w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search rooms or buildings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2 w-full lg:w-auto">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Lecture Hall">Lecture Hall</SelectItem>
              <SelectItem value="Computer Lab">Computer Lab</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex border rounded-md overflow-hidden shrink-0">
            <button
              onClick={() => setFilterAvailable(null)}
              className={`px-3 py-2 text-sm ${filterAvailable === null ? 'bg-primary text-primary-foreground' : 'bg-background hover:bg-muted'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterAvailable(true)}
              className={`px-3 py-2 text-sm ${filterAvailable === true ? 'bg-status-available text-white' : 'bg-background hover:bg-muted'}`}
            >
              Free
            </button>
            <button
              onClick={() => setFilterAvailable(false)}
              className={`px-3 py-2 text-sm ${filterAvailable === false ? 'bg-status-busy text-white' : 'bg-background hover:bg-muted'}`}
            >
              Busy
            </button>
          </div>
        </div>
      </div>

      {/* Classroom Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClassrooms.map((room, index) => (
          <Card
            key={room.id}
            variant="interactive"
            className={`animate-slide-up ${room.isRealTimeAvailable ? '' : 'opacity-90'}`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${room.isRealTimeAvailable ? 'bg-status-available/10' : 'bg-status-busy/10'
                    }`}>
                    <Building2 className={`w-6 h-6 ${room.isRealTimeAvailable ? 'text-status-available' : 'text-status-busy'
                      }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{room.room_no}</h3>
                    <p className="text-sm text-muted-foreground">{room.building}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${room.isRealTimeAvailable
                  ? 'bg-status-available/10 text-status-available'
                  : 'bg-status-busy/10 text-status-busy'
                  }`}>
                  {room.isRealTimeAvailable ? 'Available' : 'Occupied'}
                </span>
              </div>

              {/* Status Detail */}
              <div className="mb-4 min-h-[1.5rem]">
                {!room.isRealTimeAvailable && room.currentStatus.activeClass ? (
                  <div className="text-xs text-status-busy flex items-center gap-1 font-medium bg-status-busy/5 p-1.5 rounded">
                    <BookOpen className="w-3 h-3" />
                    {room.currentStatus.activeClass.subject} ({room.currentStatus.activeClass.section})
                  </div>
                ) : !room.is_available ? (
                  <div className="text-xs text-orange-500 font-medium bg-orange-500/5 p-1.5 rounded">
                    ⚠ Maintenance / Manual Lock
                  </div>
                ) : (
                  <div className="text-xs text-status-available font-medium bg-status-available/5 p-1.5 rounded flex items-center gap-1">
                    <Check className="w-3 h-3" /> Ready for use
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 border-t pt-3">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{room.capacity} seats</span>
                </div>
                <span>•</span>
                <span>{room.type}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {room.amenities && room.amenities.includes("wifi") && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground">
                    <Wifi className="w-3 h-3" /> WiFi
                  </span>
                )}
                {room.amenities && room.amenities.includes("projector") && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground">
                    <Projector className="w-3 h-3" /> Projector
                  </span>
                )}
                {room.amenities && room.amenities.includes("computers") && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground">
                    <Monitor className="w-3 h-3" /> PCs
                  </span>
                )}
                {room.amenities && room.amenities.includes("ac") && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground">
                    AC
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClassrooms.length === 0 && (
        <Card variant="glass" className="p-12 text-center">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No classrooms found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or time slot</p>
        </Card>
      )}
    </div>
  );
};

export default Classrooms;
