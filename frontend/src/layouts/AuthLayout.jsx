import { Outlet, useLocation } from "react-router-dom";
import { BrainCircuit, Check, FileText, MessageSquare, Sparkles, Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function AuthLayout() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const isRegister = location.pathname.includes("register");

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      <div className="orb orb-a" /><div className="orb orb-b" /><div className="orb orb-c" />
      <button onClick={toggleTheme} className="fixed right-5 top-5 z-50 h-10 w-10 rounded-full glass flex items-center justify-center hover:scale-105 transition-transform" aria-label="Toggle theme">
        {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>

      <div className="min-h-screen grid lg:grid-cols-[1.08fr_.92fr]">
        <section className="relative hidden lg:flex flex-col justify-between p-10 xl:p-14 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/.2),transparent_30%),radial-gradient(circle_at_80%_80%,hsl(158_55%_55%/.16),transparent_32%)] border-r border-border/70">
          <div className="flex items-center gap-3 page-enter">
            <div className="h-11 w-11 rounded-2xl bg-foreground text-background flex items-center justify-center shadow-xl"><BrainCircuit className="h-6 w-6" /></div>
            <div><div className="font-bold tracking-tight">AI Knowledge Base</div><div className="text-xs text-muted-foreground">Private knowledge, smarter answers.</div></div>
          </div>

          <div className="max-w-2xl page-enter">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-semibold mb-6">
              <Sparkles className="h-3.5 w-3.5 text-primary" /> RAG-powered workspace
            </div>
            <h1 className="text-6xl xl:text-7xl font-black tracking-[-.055em] leading-[.95]">
              Your knowledge.<br /><span className="gradient-text">Finally useful.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg text-muted-foreground leading-8">Upload your documents, ask natural questions, and get answers grounded in the sources you actually trust.</p>
            <div className="grid grid-cols-3 gap-3 mt-9 max-w-2xl">
              {[[FileText,"Your docs","PDF · DOCX · TXT"],[MessageSquare,"AI chat","Ask naturally"],[Check,"Cited answers","Trace every claim"]].map(([Icon,title,sub]) => (
                <div key={title} className="glass rounded-2xl p-4 lift"><Icon className="h-5 w-5 text-primary mb-6"/><div className="font-semibold text-sm">{title}</div><div className="text-xs text-muted-foreground mt-1">{sub}</div></div>
              ))}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">Built for focused work · Your documents stay the source of truth.</div>
        </section>

        <section className="relative flex items-center justify-center p-5 sm:p-10">
          <div className="w-full max-w-md page-enter">
            <div className="lg:hidden flex items-center gap-3 mb-10">
              <div className="h-10 w-10 rounded-xl bg-foreground text-background flex items-center justify-center"><BrainCircuit className="h-5 w-5" /></div>
              <span className="font-bold">AI Knowledge Base</span>
            </div>
            <div className="mb-7">
              <span className="text-xs font-bold uppercase tracking-[.18em] text-primary">{isRegister ? "Get started" : "Welcome back"}</span>
              <div className="mt-2 h-1 w-12 rounded-full bg-primary" />
            </div>
            <Outlet />
          </div>
        </section>
      </div>
    </div>
  );
}
