import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Clock, 
  Building2, 
  Users, 
  FileText, 
  TrendingUp,
  BookOpen,
  Bell
} from "lucide-react";
import { Link } from "react-router-dom";

const quickLinks = [
  { icon: Calendar, label: "My Timetable", path: "/dashboard/timetable", color: "from-primary to-primary/70" },
  { icon: Clock, label: "Free Periods", path: "/dashboard/free-periods", color: "from-accent to-accent/70" },
  { icon: Building2, label: "Empty Classrooms", path: "/dashboard/classrooms", color: "from-campus-purple to-campus-purple/70" },
  { icon: Users, label: "Professors", path: "/dashboard/professors", color: "from-status-available to-status-available/70" },
];

const todaySchedule = [
  { time: "09:00 - 10:00", subject: "Data Structures", room: "CS-201", type: "Lecture" },
  { time: "10:00 - 11:00", subject: "Free Period", room: "-", type: "free" },
  { time: "11:00 - 12:00", subject: "Database Systems", room: "CS-105", type: "Lab" },
  { time: "12:00 - 01:00", subject: "Lunch Break", room: "-", type: "break" },
  { time: "02:00 - 03:00", subject: "Computer Networks", room: "CS-301", type: "Lecture" },
  { time: "03:00 - 04:00", subject: "Free Period", room: "-", type: "free" },
];

const recentMaterials = [
  { name: "CN Unit 3 Notes", subject: "Computer Networks", date: "2 hours ago" },
  { name: "DBMS Lab Manual", subject: "Database Systems", date: "Yesterday" },
  { name: "DSA Practice Problems", subject: "Data Structures", date: "2 days ago" },
];

const Dashboard = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Good Morning, John! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening on your campus today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Bell className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">2 free periods today</span>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickLinks.map((link, index) => (
          <Link 
            key={link.path} 
            to={link.path}
            className={`animate-slide-up stagger-${index + 1}`}
            style={{ opacity: 0 }}
          >
            <Card variant="interactive" className="h-full">
              <CardContent className="p-4 lg:p-6">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${link.color} flex items-center justify-center mb-3`}>
                  <link.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground">{link.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">View details →</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <Card variant="glass" className="lg:col-span-2 animate-slide-up stagger-3" style={{ opacity: 0 }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Today's Schedule
            </CardTitle>
            <Link to="/dashboard/timetable" className="text-sm text-primary hover:underline">
              View Full →
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaySchedule.map((slot, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                    slot.type === 'free' 
                      ? 'bg-status-available/10 border border-status-available/20' 
                      : slot.type === 'break'
                      ? 'bg-muted/50'
                      : 'bg-muted/30 hover:bg-muted/50'
                  }`}
                >
                  <div className="w-24 flex-shrink-0">
                    <p className="text-sm font-medium text-foreground">{slot.time.split(' - ')[0]}</p>
                    <p className="text-xs text-muted-foreground">{slot.time.split(' - ')[1]}</p>
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${slot.type === 'free' ? 'text-status-available' : 'text-foreground'}`}>
                      {slot.subject}
                    </p>
                    {slot.room !== '-' && (
                      <p className="text-xs text-muted-foreground">Room: {slot.room}</p>
                    )}
                  </div>
                  {slot.type === 'Lecture' && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary">
                      Lecture
                    </span>
                  )}
                  {slot.type === 'Lab' && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent">
                      Lab
                    </span>
                  )}
                  {slot.type === 'free' && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-status-available/10 text-status-available">
                      Free
                    </span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Materials */}
        <Card variant="glass" className="animate-slide-up stagger-4" style={{ opacity: 0 }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Recent Materials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMaterials.map((material, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground text-sm truncate">{material.name}</p>
                    <p className="text-xs text-muted-foreground">{material.subject}</p>
                    <p className="text-xs text-muted-foreground mt-1">{material.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link 
              to="/dashboard/materials"
              className="mt-4 block text-center text-sm text-primary hover:underline"
            >
              View All Materials →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up stagger-5" style={{ opacity: 0 }}>
        <Card variant="default">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-xs text-muted-foreground">Empty Rooms</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="default">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-status-available/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-status-available" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">8</p>
                <p className="text-xs text-muted-foreground">Available Profs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="default">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <FileText className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">45</p>
                <p className="text-xs text-muted-foreground">Study Materials</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card variant="default">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-campus-purple/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-campus-purple" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">92%</p>
                <p className="text-xs text-muted-foreground">Attendance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
