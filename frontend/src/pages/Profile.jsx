import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/authService";
import { useToast } from "@/components/ui/use-toast";
import { Card,CardContent,CardHeader,CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, UserRound, ShieldCheck, Sparkles } from "lucide-react";
export default function Profile(){
 const {user}=useAuth();const [name,setName]=useState(user?.name||"");const [loading,setLoading]=useState(false);const {toast}=useToast();
 const submit=async e=>{e.preventDefault();setLoading(true);try{const res=await authService.updateProfile({name});localStorage.setItem("user",JSON.stringify(res.data.user));toast({title:"Profile updated"})}catch(error){toast({variant:"destructive",title:"Update failed",description:error.response?.data?.message})}finally{setLoading(false)}};
 return <div className="page-enter max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
  <div><div className="inline-flex items-center gap-2 text-xs font-bold text-primary"><Sparkles className="h-3.5 w-3.5"/> Workspace settings</div><h1 className="text-4xl font-black tracking-[-.045em] mt-2">Your profile.</h1><p className="text-muted-foreground mt-2">Manage your identity and account details.</p></div>
  <div className="grid lg:grid-cols-[.8fr_1.2fr] gap-5">
   <Card className="surface-card overflow-hidden"><div className="h-28 bg-[radial-gradient(circle_at_20%_20%,hsl(var(--primary)/.55),transparent_35%),radial-gradient(circle_at_80%_80%,hsl(158_55%_55%/.35),transparent_40%)]"/><CardContent className="relative pt-0"><div className="-mt-10 h-20 w-20 rounded-2xl border-4 border-card bg-foreground text-background flex items-center justify-center text-2xl font-black shadow-xl">{user?.name?.[0]?.toUpperCase()||"U"}</div><h2 className="text-xl font-black mt-4">{user?.name}</h2><p className="text-sm text-muted-foreground mt-1 break-all">{user?.email}</p><Badge className="mt-4 capitalize">{user?.role}</Badge><div className="mt-6 rounded-2xl bg-muted/60 p-4"><ShieldCheck className="h-4 w-4 text-primary"/><p className="text-xs text-muted-foreground mt-2">Your account controls access to your private knowledge workspace.</p></div></CardContent></Card>
   <Card className="surface-card"><CardHeader><CardTitle>Account details</CardTitle><p className="text-sm text-muted-foreground">Update the name shown across your workspace.</p></CardHeader><CardContent><form onSubmit={submit} className="space-y-5"><div className="space-y-2"><Label htmlFor="name">Name</Label><div className="relative"><UserRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/><Input id="name" value={name} onChange={e=>setName(e.target.value)} className="h-12 rounded-xl pl-10"/></div></div><div className="space-y-2"><Label>Email</Label><Input value={user?.email||""} disabled className="h-12 rounded-xl"/><p className="text-xs text-muted-foreground">Email cannot be changed here.</p></div><Button type="submit" disabled={loading} className="h-11 rounded-xl bg-foreground text-background hover:bg-primary hover:text-primary-foreground">{loading&&<Loader2 className="mr-2 h-4 w-4 animate-spin"/>}Save changes</Button></form></CardContent></Card>
  </div>
 </div>;
}
