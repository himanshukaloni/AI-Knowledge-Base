import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BrainCircuit, LayoutDashboard, FileText, MessageSquare, ShieldCheck, X,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/documents", label: "Documents", icon: FileText },
  { to: "/chat", label: "Chat", icon: MessageSquare },
];

export default function Sidebar({ open, onClose }) {
  const { isAdmin } = useAuth();

  const linkClasses = ({ isActive }) =>
    cn(
      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
      isActive
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    );

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-5">
        <div className="flex items-center gap-2 font-semibold">
          <BrainCircuit className="h-6 w-6 text-primary" />
          <span>AI Knowledge Base</span>
        </div>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={linkClasses} onClick={onClose}>
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}

        {isAdmin && (
          <NavLink to="/admin" className={linkClasses} onClick={onClose}>
            <ShieldCheck className="h-4 w-4" />
            Admin Panel
          </NavLink>
        )}
      </nav>

      <div className="px-4 py-4 text-xs text-muted-foreground border-t">
        RAG powered by OpenAI + MongoDB Atlas
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 flex-col border-r bg-card">{content}</aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={onClose} />
          <aside className="absolute left-0 top-0 h-full w-64 bg-card shadow-xl">{content}</aside>
        </div>
      )}
    </>
  );
}
