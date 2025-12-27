import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const timeSlots = [
  "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"
];

const scheduleData: Record<string, Record<string, { subject: string; room: string; type: string } | null>> = {
  Monday: {
    "09:00": { subject: "Data Structures", room: "CS-201", type: "Lecture" },
    "10:00": null,
    "11:00": { subject: "Database Systems", room: "CS-105", type: "Lab" },
    "12:00": { subject: "Lunch", room: "-", type: "break" },
    "13:00": { subject: "Computer Networks", room: "CS-301", type: "Lecture" },
    "14:00": null,
    "15:00": { subject: "Operating Systems", room: "CS-202", type: "Lecture" },
    "16:00": null,
  },
  Tuesday: {
    "09:00": { subject: "Mathematics III", room: "CS-101", type: "Lecture" },
    "10:00": { subject: "Data Structures Lab", room: "Lab-3", type: "Lab" },
    "11:00": { subject: "Data Structures Lab", room: "Lab-3", type: "Lab" },
    "12:00": { subject: "Lunch", room: "-", type: "break" },
    "13:00": null,
    "14:00": { subject: "Soft Skills", room: "CS-401", type: "Lecture" },
    "15:00": null,
    "16:00": null,
  },
  Wednesday: {
    "09:00": null,
    "10:00": { subject: "Computer Networks", room: "CS-301", type: "Lecture" },
    "11:00": { subject: "Database Systems", room: "CS-201", type: "Lecture" },
    "12:00": { subject: "Lunch", room: "-", type: "break" },
    "13:00": { subject: "Operating Systems", room: "CS-202", type: "Lecture" },
    "14:00": { subject: "CN Lab", room: "Lab-2", type: "Lab" },
    "15:00": { subject: "CN Lab", room: "Lab-2", type: "Lab" },
    "16:00": null,
  },
  Thursday: {
    "09:00": { subject: "Data Structures", room: "CS-201", type: "Lecture" },
    "10:00": { subject: "Mathematics III", room: "CS-101", type: "Lecture" },
    "11:00": null,
    "12:00": { subject: "Lunch", room: "-", type: "break" },
    "13:00": { subject: "DBMS Lab", room: "Lab-1", type: "Lab" },
    "14:00": { subject: "DBMS Lab", room: "Lab-1", type: "Lab" },
    "15:00": null,
    "16:00": null,
  },
  Friday: {
    "09:00": { subject: "Operating Systems", room: "CS-202", type: "Lecture" },
    "10:00": null,
    "11:00": { subject: "Computer Networks", room: "CS-301", type: "Lecture" },
    "12:00": { subject: "Lunch", room: "-", type: "break" },
    "13:00": { subject: "Data Structures", room: "CS-201", type: "Lecture" },
    "14:00": null,
    "15:00": { subject: "Sports/Library", room: "Ground", type: "activity" },
    "16:00": null,
  },
  Saturday: {
    "09:00": { subject: "Mentoring", room: "CS-401", type: "activity" },
    "10:00": null,
    "11:00": { subject: "Guest Lecture", room: "Seminar Hall", type: "Lecture" },
    "12:00": null,
    "13:00": null,
    "14:00": null,
    "15:00": null,
    "16:00": null,
  },
};

const Timetable = () => {
  const [currentWeek, setCurrentWeek] = useState(0);

  const getSlotColor = (type: string | undefined) => {
    if (!type) return "bg-status-available/10 border-status-available/30 border-2 border-dashed";
    switch (type) {
      case "Lecture":
        return "bg-primary/10 border-primary/20";
      case "Lab":
        return "bg-accent/10 border-accent/20";
      case "break":
        return "bg-muted border-border";
      case "activity":
        return "bg-campus-purple/10 border-campus-purple/20";
      default:
        return "bg-muted";
    }
  };

  const getSlotTextColor = (type: string | undefined) => {
    if (!type) return "text-status-available";
    switch (type) {
      case "Lecture":
        return "text-primary";
      case "Lab":
        return "text-accent";
      case "break":
        return "text-muted-foreground";
      case "activity":
        return "text-campus-purple";
      default:
        return "text-foreground";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">My Timetable</h1>
          <p className="text-muted-foreground mt-1">View and manage your weekly schedule</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setCurrentWeek(w => w - 1)}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="px-4 py-2 text-sm font-medium bg-muted rounded-lg">
            Week {currentWeek === 0 ? "Current" : currentWeek > 0 ? `+${currentWeek}` : currentWeek}
          </span>
          <Button variant="outline" size="icon" onClick={() => setCurrentWeek(w => w + 1)}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/20 border border-primary/30" />
          <span className="text-muted-foreground">Lecture</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-accent/20 border border-accent/30" />
          <span className="text-muted-foreground">Lab</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-status-available/20 border-2 border-dashed border-status-available/50" />
          <span className="text-muted-foreground">Free Period</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-campus-purple/20 border border-campus-purple/30" />
          <span className="text-muted-foreground">Activity</span>
        </div>
      </div>

      {/* Timetable Grid - Desktop */}
      <Card variant="glass" className="hidden lg:block overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-muted/50">
                  <th className="p-4 text-left text-sm font-semibold text-foreground border-b border-border w-20">
                    <Clock className="w-4 h-4 inline-block mr-2" />
                    Time
                  </th>
                  {days.map(day => (
                    <th key={day} className="p-4 text-center text-sm font-semibold text-foreground border-b border-border">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(time => (
                  <tr key={time} className="hover:bg-muted/30 transition-colors">
                    <td className="p-4 text-sm font-medium text-foreground border-b border-border bg-muted/20">
                      {time}
                    </td>
                    {days.map(day => {
                      const slot = scheduleData[day]?.[time];
                      return (
                        <td key={`${day}-${time}`} className="p-2 border-b border-border">
                          <div
                            className={`p-3 rounded-lg min-h-[60px] transition-all hover:scale-[1.02] cursor-pointer ${getSlotColor(slot?.type)} border`}
                          >
                            {slot ? (
                              <>
                                <p className={`font-medium text-sm ${getSlotTextColor(slot.type)}`}>
                                  {slot.subject}
                                </p>
                                {slot.room !== '-' && (
                                  <p className="text-xs text-muted-foreground mt-1">{slot.room}</p>
                                )}
                              </>
                            ) : (
                              <p className="text-sm text-status-available font-medium">Free</p>
                            )}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Timetable Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {days.map(day => (
          <Card key={day} variant="glass">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{day}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {timeSlots.map(time => {
                  const slot = scheduleData[day]?.[time];
                  return (
                    <div
                      key={`${day}-${time}`}
                      className={`flex items-center gap-4 p-3 rounded-lg ${getSlotColor(slot?.type)} border`}
                    >
                      <span className="text-sm font-medium text-foreground w-14">{time}</span>
                      <div className="flex-1">
                        {slot ? (
                          <>
                            <p className={`font-medium text-sm ${getSlotTextColor(slot.type)}`}>
                              {slot.subject}
                            </p>
                            {slot.room !== '-' && (
                              <p className="text-xs text-muted-foreground">{slot.room}</p>
                            )}
                          </>
                        ) : (
                          <p className="text-sm text-status-available font-medium">Free Period</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Timetable;
