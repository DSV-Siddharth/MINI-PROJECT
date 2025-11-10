import { Home, FileText, CheckCircle, MessageSquare, HelpCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Resume Generator", href: "/resume-generator", icon: FileText },
  { name: "Resume Checker", href: "/resume-checker", icon: CheckCircle },
  { name: "Interview Coach", href: "/interview-coach", icon: MessageSquare },
  { name: "Interview Questions", href: "/questions", icon: HelpCircle },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar transition-transform">
      <div className="flex h-full flex-col">
        <div className="flex h-20 items-center border-b border-sidebar-border px-6">
          <h1 className="font-serif text-3xl font-semibold tracking-luxury text-sidebar-primary drop-shadow-glow">
            Job-verse
          </h1>
        </div>
        
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => (
            <NavLink
              key={item.name}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )
              }
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-gradient-accent p-4 shadow-glow-accent text-accent-foreground">
            <p className="text-sm font-semibold tracking-luxury">Ready to land your dream job?</p>
            <p className="mt-1 text-xs font-medium opacity-80">Start with your resume!</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
