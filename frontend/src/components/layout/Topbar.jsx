import { Menu, Sun, Moon, LogOut, User as UserIcon, Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useNavigate } from "react-router-dom";

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const initials = user?.name?.split(" ").map((n)=>n[0]).slice(0,2).join("").toUpperCase() || "U";
  return <header className="sticky top-0 z-30 h-[72px] flex items-center justify-between border-b bg-background/75 backdrop-blur-xl px-4 sm:px-6">
    <div className="flex items-center gap-3">
      <Button variant="ghost" size="icon" className="lg:hidden" onClick={onMenuClick}><Menu className="h-5 w-5"/></Button>
      <div className="hidden sm:flex items-center gap-2 rounded-xl border bg-card/70 px-3 py-2 text-xs text-muted-foreground"><Search className="h-3.5 w-3.5"/><span>Search your workspace</span><kbd className="ml-5 rounded-md bg-muted px-1.5 py-0.5 text-[10px]">⌘ K</kbd></div>
    </div>
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="icon" className="rounded-xl" onClick={toggleTheme}>{theme === "dark" ? <Sun className="h-4 w-4"/> : <Moon className="h-4 w-4"/>}</Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" className="gap-2 rounded-xl px-2.5"><Avatar className="h-9 w-9 ring-2 ring-primary/20"><AvatarFallback className="bg-primary/15 text-primary font-bold">{initials}</AvatarFallback></Avatar><span className="hidden sm:block text-sm font-semibold max-w-28 truncate">{user?.name}</span><ChevronDown className="h-3.5 w-3.5 text-muted-foreground"/></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2">
          <DropdownMenuLabel className="px-3 py-2"><div className="font-semibold">{user?.name}</div><div className="font-normal text-xs text-muted-foreground mt-0.5 truncate">{user?.email}</div></DropdownMenuLabel><DropdownMenuSeparator/>
          <DropdownMenuItem className="rounded-xl py-2.5" onClick={()=>navigate("/profile")}><UserIcon className="mr-2 h-4 w-4"/> Profile</DropdownMenuItem>
          <DropdownMenuItem className="rounded-xl py-2.5 text-destructive focus:text-destructive" onClick={logout}><LogOut className="mr-2 h-4 w-4"/> Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>;
}
