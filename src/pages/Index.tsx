import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Calendar, Clock, Building2, Users, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-campus-sky via-background to-campus-lavender flex flex-col">
      {/* Navbar */}
      <nav className="p-6 flex justify-between items-center animate-fade-in backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl text-foreground hidden sm:block">Smart Campus</span>
        </div>
        <div className="flex gap-4">
          <Button variant="ghost" onClick={() => navigate("/login")}>
            Login
          </Button>
          <Button variant="campus" onClick={() => navigate("/signup")}>
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 container mx-auto px-4 flex flex-col justify-center items-center text-center py-20 relative overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />

        <div className="max-w-3xl space-y-8 relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4 animate-slide-up">
            🚀 Your Academic Companion
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground animate-slide-up stagger-1">
            Navigate Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Campus Life</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up stagger-2">
            The all-in-one platform for students to manage schedules, find empty classrooms, and access study materials.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8 animate-slide-up stagger-3">
            <Button size="lg" className="h-12 px-8 text-lg group" variant="campus" onClick={() => navigate("/signup")}>
              Join Now <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button size="lg" variant="outline" className="h-12 px-8 text-lg" onClick={() => navigate("/login")}>
              Sign In
            </Button>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-24 bg-card/30 backdrop-blur-sm border-t border-border/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-on-scroll">
            <h2 className="text-3xl font-bold mb-4">Everything You Need</h2>
            <p className="text-muted-foreground">Powerful features to streamline your university experience</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Calendar className="w-8 h-8 text-primary" />}
              title="Smart Timetable"
              description="View your daily schedule and get notified about upcoming classes."
              delay="0"
            />
            <FeatureCard
              icon={<Clock className="w-8 h-8 text-accent" />}
              title="Track Free Periods"
              description="Identify free slots in your schedule to plan your study time."
              delay="1"
            />
            <FeatureCard
              icon={<Building2 className="w-8 h-8 text-campus-purple" />}
              title="Empty Classrooms"
              description="Find available rooms for self-study or group projects instantly."
              delay="2"
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-status-available" />}
              title="Faculty Info"
              description="Access professor profiles and availability for key subjects."
              delay="3"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border">
        <p>© 2024 Smart Campus / KL University. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: string }) => (
  <div className={`bg-card/50 p-6 rounded-2xl border border-border/50 hover:border-primary/50 transition-colors hover:shadow-lg hover:-translate-y-1 duration-300 animate-slide-up stagger-${delay}`}>
    <div className="w-14 h-14 rounded-xl bg-background flex items-center justify-center mb-4 shadow-sm">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-slate-500">{description}</p>
  </div>
);

export default Index;
