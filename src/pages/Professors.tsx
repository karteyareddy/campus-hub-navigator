import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  MapPin,
  Clock,
  Mail,
  MessageCircle,
  Calendar
} from "lucide-react";
import { parseCSV, decodeRoom, TimetableEntry, getAllUniqueFaculties } from "@/utils/timetableUtils";
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

const Professors = () => {
  const [loading, setLoading] = useState(true);
  const [allEntries, setAllEntries] = useState<TimetableEntry[]>([]);
  const [faculties, setFaculties] = useState<string[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterAvailable, setFilterAvailable] = useState<boolean | null>(null);

  // Default to current time logic
  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [selectedTime, setSelectedTime] = useState<string>("09:00-10:00");

  useEffect(() => {
    // Auto-select current day
    const d = new Date();
    const dayName = days[d.getDay() - 1];
    if (dayName) setSelectedDay(dayName);

    // Auto-select current time slot (rough approximation)
    const hour = d.getHours();
    if (hour >= 9 && hour <= 16) {
      // e.g., 9 -> 09:00-10:00, 12 -> 12:00-01:00
      const start = hour > 12 ? hour - 12 : hour;
      const end = hour + 1 > 12 ? hour + 1 - 12 : hour + 1;
      const searchStr = `${start.toString().padStart(2, '0')}:00`;
      const found = timeSlots.find(t => t.startsWith(searchStr));
      if (found) setSelectedTime(found);
    }

    fetchData();
  }, []);

  const fetchData = async () => {
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

      setAllEntries(combined);
      setFaculties(getAllUniqueFaculties(combined));
      setLoading(false);
    } catch (error) {
      console.error("Failed to load data", error);
      toast.error("Failed to load professor data");
      setLoading(false);
    }
  };

  // Compute status for each faculty based on selected slot
  const getFacultyStatus = (facultyName: string) => {
    const activeClass = allEntries.find(e =>
      e.faculty === facultyName &&
      e.day.toLowerCase() === selectedDay.toLowerCase() &&
      e.time === selectedTime
    );

    if (activeClass) {
      return {
        available: false,
        subject: activeClass.subject,
        location: activeClass.roomRaw,
        decodedLoc: activeClass.roomDecoded,
        section: activeClass.section
      };
    }
    return { available: true };
  };

  if (loading) {
    return <div className="flex items-center justify-center p-12"><div className="animate-spin w-8 h-8 border-4 border-primary rounded-full border-t-transparent"></div></div>;
  }

  // Filter and Map
  const processedProfessors = faculties.map((name, idx) => {
    const status = getFacultyStatus(name);
    // Fake email generator
    const email = `${name.toLowerCase().replace(/\s+/g, '.')}@klu.ac.in`;

    return {
      id: idx,
      name,
      email,
      department: "Computer Science", // Defaulting for now as CSV lacks this
      ...status
    };
  }).filter(prof => {
    const matchesSearch = prof.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAvailable = filterAvailable === null || prof.available === filterAvailable;
    return matchesSearch && matchesAvailable;
  });

  const availableCount = processedProfessors.filter(p => p.available).length;

  return (
    <div className="space-y-6 animate-fade-in p-2 md:p-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Professor Availability</h1>
          <p className="text-muted-foreground mt-1">Real-time status based on timetable</p>
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
            {availableCount} Available Now
          </span>
        </div>

        <div className="w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full"
          />
        </div>

        <div className="flex gap-2 w-full lg:w-auto">
          <Button
            variant={filterAvailable === null ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterAvailable(null)}
            className="flex-1 lg:flex-none"
          >
            All
          </Button>
          <Button
            variant={filterAvailable === true ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterAvailable(true)}
            className={`flex-1 lg:flex-none ${filterAvailable === true ? "bg-status-available hover:bg-status-available/90" : ""}`}
          >
            Available
          </Button>
          <Button
            variant={filterAvailable === false ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterAvailable(false)}
            className={`flex-1 lg:flex-none ${filterAvailable === false ? "bg-status-busy hover:bg-status-busy/90" : ""}`}
          >
            Busy
          </Button>
        </div>
      </div>

      {/* Professors Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {processedProfessors.map((prof, index) => (
          <Card
            key={prof.id}
            variant="interactive"
            className={`animate-slide-up ${prof.available ? '' : 'opacity-90'}`}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold ${prof.available
                    ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                  }`}>
                  {prof.name.substring(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{prof.name}</h3>
                      <p className="text-xs text-muted-foreground truncate">{prof.email}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${prof.available
                        ? 'bg-status-available/10 text-status-available'
                        : 'bg-status-busy/10 text-status-busy'
                      }`}>
                      {prof.available ? 'Available' : 'Busy'}
                    </span>
                  </div>

                  <div className="mt-3 space-y-2">
                    {!prof.available ? (
                      <>
                        <div className="flex items-center gap-2 text-sm text-foreground font-medium">
                          <Clock className="w-4 h-4 flex-shrink-0 text-orange-500" />
                          <span>Teaching {prof.subject}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4 flex-shrink-0" />
                          <span>Room {prof.location} {prof.decodedLoc ? `(B${prof.decodedLoc.block}-F${prof.decodedLoc.floor})` : ''} - {prof.section}</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-2 text-sm text-status-available">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>Available throughout this slot</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions - Only if available (or maybe email is always useful) */}
              <div className="flex items-center gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1 text-xs h-8">
                  <Mail className="w-3 h-3 mr-1" />
                  Email
                </Button>
                {prof.available && (
                  <Button variant="campus" size="sm" className="flex-1 text-xs h-8">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    Chat
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {processedProfessors.length === 0 && (
        <Card variant="glass" className="p-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No professors found</h3>
          <p className="text-muted-foreground">Try adjusting your filters</p>
        </Card>
      )}
    </div>
  );
};

export default Professors;
