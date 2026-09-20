import { useDashboard } from "@/hooks/useDashboard";
import StatCard from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageSquare, CheckCircle2, MessagesSquare, ArrowUpRight, Sparkles, UploadCloud } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "@/utils/date";

export default function Dashboard() {
  const { data, isLoading } = useDashboard();
  const stats = data?.data?.stats;
  const recentUploads = data?.data?.recentUploads || [];
  const recentChats = data?.data?.recentChats || [];
  return <div className="page-enter max-w-[1500px] mx-auto p-4 sm:p-6 lg:p-8 space-y-7">
    <section className="relative overflow-hidden rounded-[28px] border bg-card p-6 sm:p-8 lg:p-10 shadow-sm">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,hsl(var(--primary)/.14),transparent_28%),radial-gradient(circle_at_65%_90%,hsl(158_55%_55%/.1),transparent_25%)]"/>
      <div className="orb orb-a opacity-20"/>
      <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-7">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1.5 text-xs font-bold mb-5"><Sparkles className="h-3.5 w-3.5 text-primary"/> Knowledge workspace</div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-[-.045em]">Good to see you back.</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl">A quick look at your documents, conversations and retrieval activity.</p>
        </div>
        <Link to="/documents" className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background px-4 py-3 text-sm font-bold hover:bg-primary hover:text-primary-foreground transition-colors"><UploadCloud className="h-4 w-4"/> Add knowledge <ArrowUpRight className="h-4 w-4"/></Link>
      </div>
    </section>

    {isLoading ? <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">{[...Array(4)].map((_,i)=><Skeleton key={i} className="h-36 rounded-2xl"/>)}</div> :
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 stagger">
        <StatCard label="Total Documents" value={stats?.totalDocuments ?? 0} icon={FileText}/>
        <StatCard label="Documents Processed" value={stats?.processedDocuments ?? 0} icon={CheckCircle2}/>
        <StatCard label="Questions Asked" value={stats?.totalQuestions ?? 0} icon={MessageSquare}/>
        <StatCard label="Conversations" value={stats?.totalConversations ?? 0} icon={MessagesSquare}/>
      </div>}

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 stagger">
      <Card className="surface-card lift overflow-hidden"><CardHeader className="flex-row items-center justify-between"><div><CardTitle>Recent uploads</CardTitle><p className="text-xs text-muted-foreground mt-1">Your latest knowledge sources</p></div><Link to="/documents" className="text-xs font-bold text-primary hover:underline">View all</Link></CardHeader><CardContent className="space-y-2">
        {recentUploads.length===0&&<div className="rounded-2xl border border-dashed p-7 text-center"><FileText className="h-6 w-6 mx-auto text-muted-foreground"/><p className="text-sm font-semibold mt-2">No documents yet</p><Link to="/documents" className="text-xs text-primary mt-1 inline-block">Upload your first document</Link></div>}
        {recentUploads.map(doc=><div key={doc._id} className="flex items-center gap-3 rounded-2xl border border-transparent hover:border-border hover:bg-muted/50 p-3 transition-colors"><div className="h-10 w-10 rounded-xl bg-secondary text-secondary-foreground flex items-center justify-center"><FileText className="h-4 w-4"/></div><div className="min-w-0 flex-1"><div className="text-sm font-semibold truncate">{doc.originalName}</div><div className="text-xs text-muted-foreground">Knowledge source</div></div><Badge variant={doc.status === "processed" ? "success" : doc.status === "failed" ? "destructive" : "warning"} className="capitalize">{doc.status}</Badge></div>)}
      </CardContent></Card>

      <Card className="surface-card lift overflow-hidden"><CardHeader className="flex-row items-center justify-between"><div><CardTitle>Recent conversations</CardTitle><p className="text-xs text-muted-foreground mt-1">Pick up where you left off</p></div><Link to="/chat" className="text-xs font-bold text-primary hover:underline">Open chat</Link></CardHeader><CardContent className="space-y-2">
        {recentChats.length===0&&<div className="rounded-2xl border border-dashed p-7 text-center"><MessageSquare className="h-6 w-6 mx-auto text-muted-foreground"/><p className="text-sm font-semibold mt-2">No conversations yet</p><Link to="/chat" className="text-xs text-primary mt-1 inline-block">Start chatting</Link></div>}
        {recentChats.map(chat=><Link key={chat._id} to={`/chat/${chat._id}`} className="flex items-center gap-3 rounded-2xl border border-transparent hover:border-border hover:bg-muted/50 p-3 transition-colors"><div className="h-10 w-10 rounded-xl bg-accent text-accent-foreground flex items-center justify-center"><MessageSquare className="h-4 w-4"/></div><div className="min-w-0 flex-1"><div className="text-sm font-semibold truncate">{chat.title}</div><div className="text-xs text-muted-foreground">{formatDistanceToNow(chat.updatedAt)}</div></div><ArrowUpRight className="h-4 w-4 text-muted-foreground"/></Link>)}
      </CardContent></Card>
    </div>
  </div>;
}
