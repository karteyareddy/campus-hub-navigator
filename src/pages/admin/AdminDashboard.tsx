import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, BookOpen, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        users: 0,
        activeUsers: 0,
        classrooms: 0,
        materials: 0,
        pyqs: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            const { count: classroomsCount } = await supabase.from('classrooms').select('*', { count: 'exact', head: true });
            const { count: materialsCount } = await supabase.from('study_materials').select('*', { count: 'exact', head: true });
            const { count: pyqsCount } = await supabase.from('previous_year_questions').select('*', { count: 'exact', head: true });

            setStats({
                users: usersCount || 0,
                activeUsers: usersCount || 0, // Simplified for now
                classrooms: classroomsCount || 0,
                materials: materialsCount || 0,
                pyqs: pyqsCount || 0
            });
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            title: "Total Users",
            value: stats.users,
            icon: Users,
            color: "text-blue-500",
            bg: "bg-blue-500/10"
        },
        {
            title: "Classrooms",
            value: stats.classrooms,
            icon: Building2,
            color: "text-green-500",
            bg: "bg-green-500/10"
        },
        {
            title: "Study Materials",
            value: stats.materials,
            icon: BookOpen,
            color: "text-purple-500",
            bg: "bg-purple-500/10"
        },
        {
            title: "Question Papers",
            value: stats.pyqs,
            icon: GraduationCap,
            color: "text-orange-500",
            bg: "bg-orange-500/10"
        },
    ];

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="relative">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-accent">Admin Command Center</h1>
                <p className="text-muted-foreground mt-2 text-lg">System Overview & Analytics</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat, index) => (
                    <Card
                        key={stat.title}
                        className="glass-card border-none relative overflow-hidden group transition-all duration-300 hover:translate-y-[-5px]"
                        style={{ animationDelay: `${index * 100}ms` }}
                    >
                        {/* Background Glow */}
                        <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full ${stat.bg} opacity-20 blur-3xl group-hover:opacity-40 transition-opacity`} />

                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                            <CardTitle className="text-sm font-medium text-muted-foreground tracking-wide">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2.5 rounded-xl ${stat.bg} backdrop-blur-sm shadow-sm`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="text-3xl font-bold text-foreground mt-2">{stat.value}</div>
                            <div className="h-1 w-full bg-muted/50 mt-4 rounded-full overflow-hidden">
                                <div className={`h-full ${stat.color.replace('text-', 'bg-')} w-full origin-left scale-x-0 animate-scale-in`} style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }} />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
