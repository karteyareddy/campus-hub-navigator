import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  Clock,
  Calendar,
  Search,
  BookOpen
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { parseCSV, decodeRoom, TimetableEntry, getAllUniqueFaculties, getAllUniqueRooms, getOccupiedFaculties, getOccupiedRooms } from "@/utils/timetableUtils";
import { toast } from "sonner";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
// Assuming generic time slots matching the CSV format usually found
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

const FreePeriods = () => {
  const [loading, setLoading] = useState(true);
  const [allEntries, setAllEntries] = useState<TimetableEntry[]>([]);
  const [allFaculties, setAllFaculties] = useState<string[]>([]);
  const [allRooms, setAllRooms] = useState<string[]>([]);

  const [selectedDay, setSelectedDay] = useState<string>("Monday");
  const [selectedTime, setSelectedTime] = useState<string>("09:00-10:00");

  useEffect(() => {
    // Current Day/Time auto-select could go here
    const d = new Date();
    const dayName = days[d.getDay() - 1] || "Monday";
    if (days.includes(dayName)) setSelectedDay(dayName);

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // List of known files - ideally dynamic, but hardcoded for now based on known files
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
        const entries = parseCSV(text, file.split('_')[0]); // Use filename prefix as section (e.g., 23S01)
        combined = [...combined, ...entries];
      }

      setAllEntries(combined);
      setAllFaculties(getAllUniqueFaculties(combined));
      setAllRooms(getAllUniqueRooms(combined));
      setLoading(false);
    } catch (error) {
      console.error("Failed to load timetable data", error);
      toast.error("Failed to load timetable data");
      setLoading(false);
    }
  };

  const getActiveClasses = () => {
    return allEntries.filter(e =>
      e.day.toLowerCase() === selectedDay.toLowerCase() &&
      e.time === selectedTime &&
      e.subject.toUpperCase() !== 'FREE' &&
      e.subject.toUpperCase() !== 'LUNCH'
    );
  };

  const getFreeFacultiesList = () => {
    const occupied = getOccupiedFaculties(allEntries, selectedDay, selectedTime);
    return allFaculties.filter(f => !occupied.includes(f));
  };

  const getFreeRoomsList = () => {
    const occupied = getOccupiedRooms(allEntries, selectedDay, selectedTime);
    return allRooms.filter(r => !occupied.includes(r));
  };

  const activeClasses = getActiveClasses();
  const freeFaculties = getFreeFacultiesList();
  const freeRooms = getFreeRoomsList();

  if (loading) {
    return <div className="flex items-center justify-center p-12"><div className="animate-spin w-8 h-8 border-4 border-primary rounded-full border-t-transparent"></div></div>;
  }

  return (
    <div className="space-y-6 animate-fade-in p-4 lg:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">Resource Availability</h1>
          <p className="text-muted-foreground mt-1">Find empty rooms and available faculty</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Select value={selectedDay} onValueChange={setSelectedDay}>
            <SelectTrigger className="w-[140px] bg-background/50 backdrop-blur-sm">
              <Calendar className="w-4 h-4 mr-2 text-primary" />
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              {days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger className="w-[160px] bg-background/50 backdrop-blur-sm">
              <Clock className="w-4 h-4 mr-2 text-primary" />
              <SelectValue placeholder="Time" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Free Rooms Card */}
        <Card className="glass-card border-none relative overflow-hidden h-full">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Building2 className="w-24 h-24" />
          </div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center justify-between gap-2 text-xl">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-green-500" />
                Free Rooms
              </div>
              <span className="text-xs font-normal px-2 py-1 rounded-full bg-green-500/10 text-green-500 whitespace-nowrap">
                {freeRooms.length} Available
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {freeRooms.length > 0 ? freeRooms.map(room => {
                const decoded = decodeRoom(room);
                return (
                  <div key={room} className="p-3 rounded-lg bg-green-500/5 border border-green-500/10 hover:bg-green-500/10 transition-colors">
                    <div className="font-bold text-lg text-green-600">{room}</div>
                    {decoded && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Block {decoded.block}, Floor {decoded.floor}
                      </div>
                    )}
                  </div>
                );
              }) : (
                <div className="col-span-2 text-center text-muted-foreground py-8">
                  No rooms available for this slot.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Free Faculties Card */}
        <Card className="glass-card border-none relative overflow-hidden h-full">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Users className="w-24 h-24" />
          </div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center justify-between gap-2 text-xl">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Available Faculty
              </div>
              <span className="text-xs font-normal px-2 py-1 rounded-full bg-blue-500/10 text-blue-500 whitespace-nowrap">
                {freeFaculties.length} Available
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {freeFaculties.length > 0 ? freeFaculties.map(fac => (
                <div key={fac} className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-600 font-bold text-xs">
                    {fac.substring(0, 2).toUpperCase()}
                  </div>
                  <span className="font-medium">{fac}</span>
                </div>
              )) : (
                <div className="text-center text-muted-foreground py-8">
                  All faculty are busy.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Active Classes Card (Who is busy?) */}
        <Card className="glass-card border-none relative overflow-hidden h-full">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <BookOpen className="w-24 h-24" />
          </div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center justify-between gap-2 text-xl">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-orange-500" />
                Ongoing Classes
              </div>
              <span className="text-xs font-normal px-2 py-1 rounded-full bg-orange-500/10 text-orange-500 whitespace-nowrap">
                {activeClasses.length} Active
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {activeClasses.length > 0 ? activeClasses.map((cls, i) => (
                <div key={i} className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/10 hover:bg-orange-500/10 transition-colors group">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-bold text-foreground">{cls.section}</span>
                    <span className="text-xs font-mono px-1.5 py-0.5 rounded bg-muted text-muted-foreground group-hover:bg-white/20">
                      {cls.roomRaw}
                    </span>
                  </div>
                  <div className="text-sm font-medium text-orange-600 truncate">{cls.subject}</div>
                  <div className="flex justify-between items-end mt-2">
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="w-3 h-3" /> {cls.faculty}
                    </div>
                    {cls.roomDecoded && (
                      <div className="text-[10px] text-muted-foreground opacity-70">
                        B{cls.roomDecoded.block}-F{cls.roomDecoded.floor}
                      </div>
                    )}
                  </div>
                </div>
              )) : (
                <div className="text-center text-muted-foreground py-8">
                  No classes scheduled for this slot.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FreePeriods;
