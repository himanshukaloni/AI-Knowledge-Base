import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { adminService } from "@/services/adminService";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, FileText, MessageSquare, Database, Trash2 } from "lucide-react";
import { formatFileSize } from "@/utils/date";

const TABS = [
  { key: "analytics", label: "Analytics" },
  { key: "users", label: "Users" },
  { key: "documents", label: "Documents" },
];

export default function AdminPanel() {
  const [tab, setTab] = useState("analytics");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">System-wide monitoring and management</p>
      </div>

      <div className="flex gap-2 border-b">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              tab === t.key ? "border-primary text-primary" : "border-transparent text-muted-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "analytics" && <AnalyticsTab />}
      {tab === "users" && <UsersTab />}
      {tab === "documents" && <DocumentsTab />}
    </div>
  );
}

function AnalyticsTab() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: () => adminService.getAnalytics(),
  });
  const analytics = data?.data;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
      </div>
    );
  }

  const cards = [
    { label: "Total Users", value: analytics?.totalUsers, icon: Users },
    { label: "Total Documents", value: analytics?.totalDocuments, icon: FileText },
    { label: "Total Chunks", value: analytics?.totalChunks, icon: Database },
    { label: "Questions Asked", value: analytics?.totalQuestions, icon: MessageSquare },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardContent className="p-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-3xl font-bold mt-1">{value ?? 0}</p>
              </div>
              <Icon className="h-6 w-6 text-primary" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          {analytics?.documentStatusBreakdown?.map((s) => (
            <Badge key={s._id} variant="outline" className="capitalize">
              {s._id}: {s.count}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function UsersTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => adminService.getUsers({ limit: 50 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminService.deleteUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast({ title: "User deleted" });
    },
    onError: (error) =>
      toast({ variant: "destructive", title: "Delete failed", description: error.response?.data?.message }),
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  const users = data?.data?.users || [];

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
          <tr>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Email</th>
            <th className="py-3 px-4">Role</th>
            <th className="py-3 px-4">Joined</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t">
              <td className="py-3 px-4 font-medium">{u.name}</td>
              <td className="py-3 px-4 text-muted-foreground">{u.email}</td>
              <td className="py-3 px-4">
                <Badge variant={u.role === "admin" ? "default" : "secondary"} className="capitalize">
                  {u.role}
                </Badge>
              </td>
              <td className="py-3 px-4 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString()}</td>
              <td className="py-3 px-4 text-right">
                {u.role !== "admin" && (
                  <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(u._id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function DocumentsTab() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "documents"],
    queryFn: () => adminService.getDocuments({ limit: 50 }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminService.deleteDocument(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "documents"] });
      toast({ title: "Document deleted" });
    },
  });

  if (isLoading) return <Skeleton className="h-64 w-full" />;

  const documents = data?.data?.documents || [];

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-left text-sm">
        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
          <tr>
            <th className="py-3 px-4">Name</th>
            <th className="py-3 px-4">Owner</th>
            <th className="py-3 px-4">Size</th>
            <th className="py-3 px-4">Status</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((d) => (
            <tr key={d._id} className="border-t">
              <td className="py-3 px-4 font-medium">{d.originalName}</td>
              <td className="py-3 px-4 text-muted-foreground">{d.owner?.email}</td>
              <td className="py-3 px-4 text-muted-foreground">{formatFileSize(d.fileSize)}</td>
              <td className="py-3 px-4">
                <Badge variant="outline" className="capitalize">{d.status}</Badge>
              </td>
              <td className="py-3 px-4 text-right">
                <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(d._id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
