import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BrainCircuit, LayoutDashboard, FileText, MessageSquare, ShieldCheck, X, Sparkles, UserRound } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { to: "/documents", label: "Knowledge", icon: FileText },
  { to: "/chat", label: "AI Chat", icon: MessageSquare },
];

export default function Sidebar({ open, onClose }) {
  const { isAdmin } = useAuth();
  const links = ({ isActive }) => cn("group relative flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-300", isActive ? "bg-foreground text-background shadow-lg shadow-foreground/10" : "text-muted-foreground hover:bg-muted/70 hover:text-foreground hover:translate-x-0.5");
  const content = (
    <div className="h-full flex flex-col p-3">
      <div className="flex items-center justify-between px-2 py-3 mb-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-foreground text-background flex items-center justify-center"><BrainCircuit className="h-5 w-5" /></div>
          <div className="min-w-0"><div className="font-bold text-sm truncate">AI Knowledge Base</div><div className="text-[10px] text-muted-foreground truncate">Private AI workspace</div></div>
        </div>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}><X className="h-4 w-4" /></Button>
      </div>
      <div className="px-2 pb-2 text-[10px] uppercase tracking-[.18em] font-bold text-muted-foreground">Workspace</div>
      <nav className="space-y-1 px-1">
        {navItems.map(({to,label,icon:Icon}) => <NavLink key={to} to={to} className={links} onClick={onClose}><Icon className="h-4 w-4"/><span>{label}</span></NavLink>)}
        {isAdmin && <NavLink to="/admin" className={links} onClick={onClose}><ShieldCheck className="h-4 w-4"/><span>Admin</span></NavLink>}
        <NavLink to="/profile" className={links} onClick={onClose}><UserRound className="h-4 w-4"/><span>Profile</span></NavLink>
      </nav>
      <div className="mt-auto p-3">
        <div className="rounded-2xl border bg-card/70 p-4 overflow-hidden relative">
          <div className="absolute -right-5 -top-5 h-16 w-16 rounded-full bg-primary/20 blur-2xl" />
          <Sparkles className="h-4 w-4 text-primary mb-3" />
          <div className="text-xs font-semibold">Grounded AI</div>
          <p className="text-[11px] text-muted-foreground mt-1 leading-4">Answers stay connected to your uploaded knowledge.</p>
        </div>
        <div className="text-[10px] text-muted-foreground px-1 pt-3">OpenAI · MongoDB Atlas</div>
      </div>
    </div>
  );
  return <>
    <aside className="hidden lg:flex w-[270px] shrink-0 border-r bg-card/55 backdrop-blur-xl">{content}</aside>
    {open && <div className="fixed inset-0 z-50 lg:hidden"><div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}/><aside className="absolute left-0 top-0 h-full w-[280px] bg-card shadow-2xl">{content}</aside></div>}
  </>;
}
