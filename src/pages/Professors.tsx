import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Search,
  MapPin,
  Clock,
  Mail,
  MessageCircle
} from "lucide-react";

const professors = [
  { id: 1, name: "Dr. Rajesh Kumar", department: "Computer Science", subject: "Data Structures", location: "CS Block, Room 101", available: true, availableUntil: "11:00 AM", email: "rajesh.k@klu.ac.in" },
  { id: 2, name: "Dr. Priya Sharma", department: "Computer Science", subject: "Database Systems", location: "CS Block, Room 105", available: true, availableUntil: "12:00 PM", email: "priya.s@klu.ac.in" },
  { id: 3, name: "Prof. Anil Reddy", department: "Computer Science", subject: "Computer Networks", location: "CS Block, Room 201", available: false, availableUntil: "", email: "anil.r@klu.ac.in" },
  { id: 4, name: "Dr. Lakshmi Devi", department: "Computer Science", subject: "Operating Systems", location: "CS Block, Room 202", available: true, availableUntil: "02:00 PM", email: "lakshmi.d@klu.ac.in" },
  { id: 5, name: "Prof. Suresh Babu", department: "Mathematics", subject: "Mathematics III", location: "Math Block, Room 101", available: false, availableUntil: "", email: "suresh.b@klu.ac.in" },
  { id: 6, name: "Dr. Venkat Rao", department: "Computer Science", subject: "Machine Learning", location: "AI Lab, Room 301", available: true, availableUntil: "03:00 PM", email: "venkat.r@klu.ac.in" },
  { id: 7, name: "Dr. Meera Patel", department: "Computer Science", subject: "Software Engineering", location: "CS Block, Room 301", available: true, availableUntil: "04:00 PM", email: "meera.p@klu.ac.in" },
  { id: 8, name: "Prof. Kiran Kumar", department: "Computer Science", subject: "Web Technologies", location: "CS Block, Room 401", available: false, availableUntil: "", email: "kiran.k@klu.ac.in" },
];

const departments = ["All Departments", "Computer Science", "Mathematics", "Electronics"];

const Professors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All Departments");
  const [filterAvailable, setFilterAvailable] = useState<boolean | null>(null);

  const filteredProfessors = professors.filter(prof => {
    const matchesSearch = prof.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prof.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = filterDepartment === "All Departments" || prof.department === filterDepartment;
    const matchesAvailable = filterAvailable === null || prof.available === filterAvailable;
    return matchesSearch && matchesDept && matchesAvailable;
  });

  const availableCount = professors.filter(p => p.available).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Professor Availability</h1>
          <p className="text-muted-foreground mt-1">Find available professors for guidance</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-status-available/10 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-status-available animate-pulse" />
          <span className="text-sm font-medium text-status-available">
            {availableCount} professors available
          </span>
        </div>
      </div>

      {/* Filters */}
      <Card variant="glass">
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search professors or subjects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <select
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
                className="h-10 px-4 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <Button
                variant={filterAvailable === null ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterAvailable(null)}
              >
                All
              </Button>
              <Button
                variant={filterAvailable === true ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterAvailable(true)}
                className={filterAvailable === true ? "bg-status-available hover:bg-status-available/90" : ""}
              >
                Available
              </Button>
              <Button
                variant={filterAvailable === false ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterAvailable(false)}
                className={filterAvailable === false ? "bg-status-busy hover:bg-status-busy/90" : ""}
              >
                Busy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professors Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredProfessors.map((prof, index) => (
          <Card 
            key={prof.id}
            variant="interactive"
            className={`animate-slide-up ${prof.available ? '' : 'opacity-75'}`}
            style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
          >
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold ${
                  prof.available 
                    ? 'bg-gradient-to-br from-primary to-accent text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {prof.name.split(' ').slice(1).map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground">{prof.name}</h3>
                      <p className="text-sm text-muted-foreground">{prof.subject}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                      prof.available 
                        ? 'bg-status-available/10 text-status-available' 
                        : 'bg-status-busy/10 text-status-busy'
                    }`}>
                      {prof.available ? 'Available' : 'Busy'}
                    </span>
                  </div>
                  
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{prof.location}</span>
                    </div>
                    {prof.available && (
                      <div className="flex items-center gap-2 text-sm text-status-available">
                        <Clock className="w-4 h-4 flex-shrink-0" />
                        <span>Available until {prof.availableUntil}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {prof.available && (
                <div className="flex items-center gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="w-4 h-4 mr-1" />
                    Email
                  </Button>
                  <Button variant="campus" size="sm" className="flex-1">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProfessors.length === 0 && (
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
