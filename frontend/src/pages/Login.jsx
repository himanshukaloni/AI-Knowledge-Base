import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, Mail, Lock, ShieldCheck } from "lucide-react";
export default function Login(){
 const [form,setForm]=useState({email:"",password:""}); const [loading,setLoading]=useState(false); const {login}=useAuth(); const {toast}=useToast(); const navigate=useNavigate();
 const submit=async e=>{e.preventDefault();setLoading(true);try{await login(form);navigate("/dashboard")}catch(error){toast({variant:"destructive",title:"Login failed",description:error.response?.data?.message||"Invalid credentials"})}finally{setLoading(false)}};
 return <div className="space-y-7">
   <div><h2 className="text-3xl sm:text-4xl font-black tracking-[-.04em]">Welcome back<span className="text-primary">.</span></h2><p className="text-sm text-muted-foreground mt-2">Sign in and continue working with your private knowledge.</p></div>
   <form onSubmit={submit} className="space-y-5">
    <div className="space-y-2"><Label htmlFor="email">Email address</Label><div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/><Input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="h-12 rounded-xl pl-10 bg-card/70" required/></div></div>
    <div className="space-y-2"><div className="flex justify-between"><Label htmlFor="password">Password</Label><span className="text-xs text-muted-foreground">Secure sign-in</span></div><div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/><Input id="password" type="password" placeholder="Enter your password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="h-12 rounded-xl pl-10 bg-card/70" required/></div></div>
    <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-foreground text-background hover:bg-primary hover:text-primary-foreground font-bold transition-all">{loading?<Loader2 className="mr-2 h-4 w-4 animate-spin"/>:<ArrowRight className="mr-2 h-4 w-4"/>}{loading?"Signing in…":"Sign in"}</Button>
   </form>
   <div className="rounded-2xl border bg-card/60 p-4 flex gap-3"><div className="h-9 w-9 rounded-xl bg-secondary flex items-center justify-center shrink-0"><ShieldCheck className="h-4 w-4 text-secondary-foreground"/></div><div><div className="text-xs font-bold">Private by design</div><p className="text-[11px] text-muted-foreground mt-1">Your documents and conversations are protected by your authenticated workspace.</p></div></div>
   <p className="text-center text-sm text-muted-foreground">Don't have an account? <Link to="/register" className="font-bold text-primary hover:underline">Create one</Link></p>
 </div>;
}
