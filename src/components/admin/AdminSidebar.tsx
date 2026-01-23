import { Home, Users, BookOpen, FileText, Database, LogOut } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const items = [
    {
        title: "Dashboard",
        url: "/admin",
        icon: Home,
    },
    {
        title: "Manage Users",
        url: "/admin/users",
        icon: Users,
    },
    {
        title: "Classrooms",
        url: "/admin/classrooms",
        icon: Database,
    },
    {
        title: "Study Materials",
        url: "/admin/materials",
        icon: BookOpen,
    },
    {
        title: "PYQs",
        url: "/admin/pyqs",
        icon: FileText,
    },
];

export function AdminSidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await supabase.auth.signOut();
            navigate("/login");
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("Error logging out");
        }
    };

    return (
        <Sidebar className="border-r border-white/10 bg-gradient-to-b from-background/95 to-background/50 backdrop-blur-xl transition-all duration-300">
            <SidebarContent>
                <div className="p-4 mb-2 animate-fade-in">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
                        Admin Panel
                    </h2>
                    <p className="text-xs text-muted-foreground">Campus Hub Navigator</p>
                </div>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-2 px-2">
                            {items.map((item, index) => (
                                <SidebarMenuItem key={item.title} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={location.pathname === item.url}
                                        tooltip={item.title}
                                        className={`
                                            relative overflow-hidden transition-all duration-300 hover:scale-105
                                            ${location.pathname === item.url
                                                ? 'bg-primary/20 text-primary shadow-lg shadow-primary/20 ring-1 ring-primary/30'
                                                : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                                            }
                                        `}
                                    >
                                        <button onClick={() => navigate(item.url)} className="flex items-center w-full p-2 rounded-lg gap-3">
                                            <item.icon className={`w-5 h-5 transition-transform duration-300 ${location.pathname === item.url ? 'scale-110' : 'group-hover:scale-110'}`} />
                                            <span className="font-medium">{item.title}</span>
                                            {location.pathname === item.url && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full shadow-[0_0_10px_2px_rgba(var(--primary),0.5)]" />
                                            )}
                                        </button>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <div className="mt-auto p-4 border-t border-white/5">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={handleLogout}
                                className="group relative overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-destructive/10 hover:text-destructive w-full justify-start p-2"
                            >
                                <LogOut className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
                                <span className="font-medium">Logout</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </div>
            </SidebarContent>
        </Sidebar>
    );
}
