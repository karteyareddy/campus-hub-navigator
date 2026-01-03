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
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const quickLinks = [
  { icon: Calendar, label: "My Timetable", path: "/dashboard/timetable", color: "from-primary to-primary/70" },
  { icon: Clock, label: "Free Periods", path: "/dashboard/free-periods", color: "from-accent to-accent/70" },
  { icon: Building2, label: "Empty Classrooms", path: "/dashboard/classrooms", color: "from-campus-purple to-campus-purple/70" },
  { icon: Users, label: "Professors", path: "/dashboard/professors", color: "from-status-available to-status-available/70" },
];

const Dashboard = () => {
  const [userName, setUserName] = useState("Student");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata.full_name || "Student");
      }
    };
    getUser();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
            Good Morning, {userName}! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's what's happening on your campus today.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Bell className="w-4 h-4 text-primary" />
          <span className="text-muted-foreground">No new notifications</span>
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
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <Calendar className="w-12 h-12 mb-3 opacity-20" />
              <p>No classes scheduled for today.</p>
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
            <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
              <FileText className="w-12 h-12 mb-3 opacity-20" />
              <p>No recent materials.</p>
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
                <p className="text-2xl font-bold text-foreground">0</p>
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
                <p className="text-2xl font-bold text-foreground">0</p>
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
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-xs text-muted-foreground">Study Materials</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
