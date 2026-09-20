import { useNavigate,useParams } from "react-router-dom";
import { useChatList,useDeleteChat } from "@/hooks/useChats";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, MessageSquare, Trash2, History } from "lucide-react";
import { cn } from "@/lib/utils";
export default function ChatSidebar(){
 const {data,isLoading}=useChatList({limit:30}); const del=useDeleteChat(); const navigate=useNavigate(); const {chatId}=useParams(); const chats=data?.data?.chats||[];
 return <aside className="hidden md:flex w-[285px] shrink-0 flex-col border-r bg-card/55 backdrop-blur-xl">
   <div className="p-4"><Button className="w-full h-11 rounded-xl justify-start bg-foreground text-background hover:bg-primary hover:text-primary-foreground" onClick={()=>navigate("/chat")}><Plus className="mr-2 h-4 w-4"/> New conversation</Button></div>
   <div className="px-5 pb-2 flex items-center gap-2 text-[10px] uppercase tracking-[.18em] font-bold text-muted-foreground"><History className="h-3.5 w-3.5"/> History</div>
   <div className="flex-1 overflow-y-auto px-3 space-y-1">
    {isLoading&&[...Array(6)].map((_,i)=><Skeleton key={i} className="h-11 rounded-xl mx-1"/>)}
    {!isLoading&&!chats.length&&<div className="m-2 rounded-2xl border border-dashed p-5 text-center"><MessageSquare className="h-5 w-5 mx-auto text-muted-foreground"/><p className="text-xs text-muted-foreground mt-2">No conversations yet</p></div>}
    {chats.map(c=><div key={c._id} className={cn("group flex items-center gap-2 rounded-xl px-3 py-3 text-sm cursor-pointer transition-all",chatId===c._id?"bg-foreground text-background shadow-md":"hover:bg-muted/70")} onClick={()=>navigate(`/chat/${c._id}`)}><MessageSquare className="h-4 w-4 shrink-0"/><span className="truncate flex-1">{c.title}</span><button className="opacity-0 group-hover:opacity-100 transition-opacity" onClick={e=>{e.stopPropagation();del.mutate(c._id);if(chatId===c._id)navigate("/chat")}}><Trash2 className="h-3.5 w-3.5"/></button></div>)}
   </div>
 </aside>;
}
