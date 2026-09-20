import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowRight, UserRound, Mail, Lock, Sparkles } from "lucide-react";
export default function Register(){
 const [form,setForm]=useState({name:"",email:"",password:""});const [loading,setLoading]=useState(false);const {register}=useAuth();const {toast}=useToast();const navigate=useNavigate();
 const submit=async e=>{e.preventDefault();setLoading(true);try{await register(form);navigate("/dashboard")}catch(error){toast({variant:"destructive",title:"Registration failed",description:error.response?.data?.message||"Something went wrong"})}finally{setLoading(false)}};
 return <div className="space-y-7">
  <div><h2 className="text-3xl sm:text-4xl font-black tracking-[-.04em]">Create your space<span className="text-primary">.</span></h2><p className="text-sm text-muted-foreground mt-2">Build a private AI workspace around the documents that matter.</p></div>
  <form onSubmit={submit} className="space-y-4">
   <div className="space-y-2"><Label htmlFor="name">Full name</Label><div className="relative"><UserRound className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/><Input id="name" placeholder="Jane Doe" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="h-12 rounded-xl pl-10 bg-card/70" required/></div></div>
   <div className="space-y-2"><Label htmlFor="email">Email address</Label><div className="relative"><Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/><Input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} className="h-12 rounded-xl pl-10 bg-card/70" required/></div></div>
   <div className="space-y-2"><Label htmlFor="password">Password</Label><div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/><Input id="password" type="password" placeholder="At least 8 characters" minLength={8} value={form.password} onChange={e=>setForm({...form,password:e.target.value})} className="h-12 rounded-xl pl-10 bg-card/70" required/></div></div>
   <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-foreground text-background hover:bg-primary hover:text-primary-foreground font-bold transition-all">{loading?<Loader2 className="mr-2 h-4 w-4 animate-spin"/>:<Sparkles className="mr-2 h-4 w-4"/>}{loading?"Creating…":"Create workspace"}<ArrowRight className="ml-auto h-4 w-4"/></Button>
  </form>
  <p className="text-center text-sm text-muted-foreground">Already have an account? <Link to="/login" className="font-bold text-primary hover:underline">Sign in</Link></p>
 </div>;
}
