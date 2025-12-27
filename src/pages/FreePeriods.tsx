import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Clock, 
  Building2, 
  Users, 
  FileText, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Link } from "react-router-dom";

const freePeriods = [
  { day: "Monday", time: "10:00 - 11:00" },
  { day: "Monday", time: "14:00 - 15:00" },
  { day: "Tuesday", time: "13:00 - 14:00" },
  { day: "Tuesday", time: "15:00 - 16:00" },
  { day: "Wednesday", time: "09:00 - 10:00" },
  { day: "Thursday", time: "11:00 - 12:00" },
  { day: "Thursday", time: "15:00 - 16:00" },
  { day: "Friday", time: "10:00 - 11:00" },
  { day: "Friday", time: "14:00 - 15:00" },
];

const suggestions = {
  classrooms: [
    { room: "CS-201", capacity: 45, type: "Lecture Hall" },
    { room: "Lab-2", capacity: 40, type: "Computer Lab" },
    { room: "CS-301", capacity: 50, type: "Lecture Hall" },
  ],
  professors: [
    { name: "Dr. Priya Sharma", subject: "Database Systems", location: "Room 105" },
    { name: "Dr. Lakshmi Devi", subject: "Operating Systems", location: "Room 202" },
  ],
  materials: [
    { name: "DSA Practice Problems", type: "PDF" },
    { name: "DBMS Unit 2 Notes", type: "PDF" },
  ],
  pyqs: [
    { subject: "Data Structures", year: 2023, type: "Mid-1" },
    { subject: "Database Systems", year: 2023, type: "End Sem" },
  ],
};

const FreePeriods = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<typeof freePeriods[0] | null>(null);

  const todaysPeriods = freePeriods.filter(p => p.day === "Monday"); // Simulating today

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Free Periods</h1>
          <p className="text-muted-foreground mt-1">Smart suggestions for your free time</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-status-available/10 rounded-lg">
          <Clock className="w-4 h-4 text-status-available" />
          <span className="text-sm font-medium text-status-available">
            {todaysPeriods.length} free periods today
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Free Periods List */}
        <div className="space-y-4">
          <h2 className="font-semibold text-foreground">This Week's Free Periods</h2>
          <div className="space-y-2">
            {freePeriods.map((period, index) => (
              <button
                key={`${period.day}-${period.time}`}
                onClick={() => setSelectedPeriod(period)}
                className={`w-full p-4 rounded-xl text-left transition-all duration-200 animate-slide-up ${
                  selectedPeriod?.day === period.day && selectedPeriod?.time === period.time
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'bg-card hover:bg-muted border border-border'
                }`}
                style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{period.day}</p>
                    <p className={`text-sm ${
                      selectedPeriod?.day === period.day && selectedPeriod?.time === period.time
                        ? 'text-primary-foreground/80'
                        : 'text-muted-foreground'
                    }`}>
                      {period.time}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 opacity-50" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Suggestions Panel */}
        <div className="lg:col-span-2">
          {selectedPeriod ? (
            <div className="space-y-4 animate-scale-in">
              <Card variant="glass" className="bg-gradient-to-br from-primary/5 to-accent/5">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <Sparkles className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-bold text-foreground">
                      Smart Suggestions
                    </h2>
                  </div>
                  <p className="text-muted-foreground">
                    For {selectedPeriod.day}, {selectedPeriod.time}
                  </p>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Available Classrooms */}
                <Card variant="interactive">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-primary" />
                      Empty Classrooms
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {suggestions.classrooms.map((room, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                          <div>
                            <p className="font-medium text-foreground text-sm">{room.room}</p>
                            <p className="text-xs text-muted-foreground">{room.type}</p>
                          </div>
                          <span className="text-xs text-muted-foreground">{room.capacity} seats</span>
                        </div>
                      ))}
                    </div>
                    <Link to="/dashboard/classrooms">
                      <Button variant="ghost" size="sm" className="w-full mt-3">
                        View All <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Available Professors */}
                <Card variant="interactive">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="w-5 h-5 text-status-available" />
                      Available Professors
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {suggestions.professors.map((prof, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xs font-bold text-primary-foreground">
                            {prof.name.split(' ').slice(1).map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground text-sm truncate">{prof.name}</p>
                            <p className="text-xs text-muted-foreground">{prof.subject}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link to="/dashboard/professors">
                      <Button variant="ghost" size="sm" className="w-full mt-3">
                        View All <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Study Materials */}
                <Card variant="interactive">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <FileText className="w-5 h-5 text-accent" />
                      Suggested Materials
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {suggestions.materials.map((material, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                          <div className="w-8 h-8 rounded-lg bg-destructive/10 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-destructive" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground text-sm truncate">{material.name}</p>
                            <p className="text-xs text-muted-foreground">{material.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link to="/dashboard/materials">
                      <Button variant="ghost" size="sm" className="w-full mt-3">
                        View All <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                {/* Relevant PYQs */}
                <Card variant="interactive">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Clock className="w-5 h-5 text-campus-purple" />
                      Relevant PYQs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {suggestions.pyqs.map((pyq, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                          <div>
                            <p className="font-medium text-foreground text-sm">{pyq.subject}</p>
                            <p className="text-xs text-muted-foreground">{pyq.year} • {pyq.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Link to="/dashboard/pyq">
                      <Button variant="ghost" size="sm" className="w-full mt-3">
                        View All <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <Card variant="glass" className="h-full flex items-center justify-center min-h-[400px]">
              <div className="text-center p-8">
                <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  Select a Free Period
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  Choose a free period from the list to see smart suggestions for classrooms, professors, and study materials.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default FreePeriods;
