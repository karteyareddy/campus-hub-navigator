import { NavLink, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  Building2, 
  Users, 
  FileText, 
  HelpCircle, 
  Flame,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
  { icon: Calendar, label: "My Timetable", path: "/dashboard/timetable" },
  { icon: Clock, label: "Free Periods", path: "/dashboard/free-periods" },
  { icon: Building2, label: "Empty Classrooms", path: "/dashboard/classrooms" },
  { icon: Users, label: "Professor Availability", path: "/dashboard/professors" },
  { icon: FileText, label: "Study Materials", path: "/dashboard/materials" },
  { icon: HelpCircle, label: "Previous Year Questions", path: "/dashboard/pyq" },
  { icon: Flame, label: "Topic Heatmap", path: "/dashboard/heatmap" },
];

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-16 left-0 z-50 h-[calc(100vh-4rem)] w-64 bg-card border-r border-border transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Close Button */}
          <div className="flex items-center justify-end p-4 lg:hidden">
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10">
              <p className="text-xs font-medium text-foreground">Need Help?</p>
              <p className="text-xs text-muted-foreground mt-1">
                Contact support for any issues
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
