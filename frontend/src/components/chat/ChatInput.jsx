import { useState, useRef } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowUp, Sparkles } from "lucide-react";

export default function ChatInput({ onSend, disabled }) {
  const [value,setValue]=useState(""); const ref=useRef(null);
  const send=()=>{const q=value.trim(); if(!q||disabled)return; onSend(q); setValue(""); if(ref.current)ref.current.style.height="auto";};
  const resize=(e)=>{setValue(e.target.value);e.target.style.height="auto";e.target.style.height=`${Math.min(e.target.scrollHeight,180)}px`;};
  return <div className="p-4 sm:p-6 bg-gradient-to-t from-background via-background to-transparent">
    <div className="max-w-3xl mx-auto">
      <div className="glass shimmer rounded-[22px] p-2 flex items-end gap-2 shadow-xl shadow-black/5">
        <div className="h-11 w-11 shrink-0 rounded-2xl bg-secondary text-secondary-foreground flex items-center justify-center"><Sparkles className="h-4 w-4"/></div>
        <Textarea ref={ref} value={value} onChange={resize} onKeyDown={(e)=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();send();}}} placeholder="Ask anything about your knowledge base…" className="min-h-[44px] max-h-44 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 py-3" disabled={disabled}/>
        <Button onClick={send} disabled={disabled||!value.trim()} className="h-11 w-11 shrink-0 rounded-2xl bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-all"><ArrowUp className="h-5 w-5"/></Button>
      </div>
      <p className="text-center text-[11px] text-muted-foreground mt-2">Enter to send · Shift + Enter for a new line · Answers stay grounded in your documents</p>
    </div>
  </div>;
}
