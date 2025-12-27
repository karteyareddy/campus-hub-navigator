import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Building2, 
  Users, 
  Search,
  Filter,
  Wifi,
  Monitor,
  Projector,
  Check
} from "lucide-react";

const classrooms = [
  { id: 1, room: "CS-101", building: "Block A", capacity: 60, type: "Lecture Hall", available: true, amenities: ["projector", "wifi", "ac"] },
  { id: 2, room: "CS-102", building: "Block A", capacity: 60, type: "Lecture Hall", available: false, amenities: ["projector", "wifi", "ac"] },
  { id: 3, room: "CS-201", building: "Block A", capacity: 45, type: "Lecture Hall", available: true, amenities: ["projector", "wifi"] },
  { id: 4, room: "CS-202", building: "Block A", capacity: 45, type: "Lecture Hall", available: true, amenities: ["wifi"] },
  { id: 5, room: "Lab-1", building: "Block B", capacity: 40, type: "Computer Lab", available: false, amenities: ["computers", "projector", "wifi", "ac"] },
  { id: 6, room: "Lab-2", building: "Block B", capacity: 40, type: "Computer Lab", available: true, amenities: ["computers", "projector", "wifi", "ac"] },
  { id: 7, room: "Lab-3", building: "Block B", capacity: 35, type: "Computer Lab", available: true, amenities: ["computers", "wifi"] },
  { id: 8, room: "Seminar Hall", building: "Block C", capacity: 150, type: "Seminar Hall", available: false, amenities: ["projector", "wifi", "ac", "mic"] },
  { id: 9, room: "CS-301", building: "Block A", capacity: 50, type: "Lecture Hall", available: true, amenities: ["projector", "wifi", "ac"] },
  { id: 10, room: "CS-401", building: "Block A", capacity: 40, type: "Lecture Hall", available: true, amenities: ["projector", "wifi"] },
];

const Classrooms = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterAvailable, setFilterAvailable] = useState<boolean | null>(null);

  const filteredClassrooms = classrooms.filter(room => {
    const matchesSearch = room.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          room.building.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || room.type === filterType;
    const matchesAvailable = filterAvailable === null || room.available === filterAvailable;
    return matchesSearch && matchesType && matchesAvailable;
  });

  const availableCount = classrooms.filter(r => r.available).length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Classroom Availability</h1>
          <p className="text-muted-foreground mt-1">Find empty classrooms in real-time</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-status-available/10 rounded-lg">
          <div className="w-2 h-2 rounded-full bg-status-available animate-pulse" />
          <span className="text-sm font-medium text-status-available">
            {availableCount} rooms available
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
                placeholder="Search rooms or buildings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
              >
                All Types
              </Button>
              <Button
                variant={filterType === "Lecture Hall" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("Lecture Hall")}
              >
                Lecture Hall
              </Button>
              <Button
                variant={filterType === "Computer Lab" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("Computer Lab")}
              >
                Computer Lab
              </Button>
            </div>
            <div className="flex gap-2">
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
                Occupied
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Classroom Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClassrooms.map((room, index) => (
          <Card 
            key={room.id} 
            variant="interactive"
            className={`animate-slide-up ${room.available ? '' : 'opacity-75'}`}
            style={{ animationDelay: `${index * 0.05}s`, opacity: 0 }}
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    room.available ? 'bg-status-available/10' : 'bg-status-busy/10'
                  }`}>
                    <Building2 className={`w-6 h-6 ${
                      room.available ? 'text-status-available' : 'text-status-busy'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{room.room}</h3>
                    <p className="text-sm text-muted-foreground">{room.building}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  room.available 
                    ? 'bg-status-available/10 text-status-available' 
                    : 'bg-status-busy/10 text-status-busy'
                }`}>
                  {room.available ? 'Available' : 'Occupied'}
                </span>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{room.capacity} seats</span>
                </div>
                <span>•</span>
                <span>{room.type}</span>
              </div>

              <div className="flex flex-wrap gap-2">
                {room.amenities.includes("wifi") && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground">
                    <Wifi className="w-3 h-3" /> WiFi
                  </span>
                )}
                {room.amenities.includes("projector") && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground">
                    <Projector className="w-3 h-3" /> Projector
                  </span>
                )}
                {room.amenities.includes("computers") && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground">
                    <Monitor className="w-3 h-3" /> PCs
                  </span>
                )}
                {room.amenities.includes("ac") && (
                  <span className="flex items-center gap-1 px-2 py-1 rounded-md bg-muted text-xs text-muted-foreground">
                    AC
                  </span>
                )}
              </div>

              {room.available && (
                <Button variant="campus" size="sm" className="w-full mt-4">
                  <Check className="w-4 h-4" />
                  Book Room
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClassrooms.length === 0 && (
        <Card variant="glass" className="p-12 text-center">
          <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No classrooms found</h3>
          <p className="text-muted-foreground">Try adjusting your filters</p>
        </Card>
      )}
    </div>
  );
};

export default Classrooms;
