import { useDashboard } from "@/hooks/useDashboard";
import StatCard from "@/components/dashboard/StatCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageSquare, CheckCircle2, MessagesSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "@/utils/date";

export default function Dashboard() {
  const { data, isLoading } = useDashboard();
  const stats = data?.data?.stats;
  const recentUploads = data?.data?.recentUploads || [];
  const recentChats = data?.data?.recentChats || [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your knowledge base activity</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Documents" value={stats?.totalDocuments ?? 0} icon={FileText} />
          <StatCard label="Documents Processed" value={stats?.processedDocuments ?? 0} icon={CheckCircle2} />
          <StatCard label="Questions Asked" value={stats?.totalQuestions ?? 0} icon={MessageSquare} />
          <StatCard label="Conversations" value={stats?.totalConversations ?? 0} icon={MessagesSquare} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Uploads</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentUploads.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No documents yet.{" "}
                <Link to="/documents" className="text-primary hover:underline">
                  Upload your first document
                </Link>
              </p>
            )}
            {recentUploads.map((doc) => (
              <div key={doc._id} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{doc.originalName}</span>
                </div>
                <Badge
                  variant={
                    doc.status === "processed" ? "success" : doc.status === "failed" ? "destructive" : "warning"
                  }
                >
                  {doc.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Chats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentChats.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No conversations yet.{" "}
                <Link to="/chat" className="text-primary hover:underline">
                  Start chatting
                </Link>
              </p>
            )}
            {recentChats.map((chat) => (
              <Link
                key={chat._id}
                to={`/chat/${chat._id}`}
                className="flex items-center justify-between text-sm hover:text-primary"
              >
                <span className="truncate">{chat.title}</span>
                <span className="text-xs text-muted-foreground shrink-0 ml-2">
                  {formatDistanceToNow(chat.updatedAt)}
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
