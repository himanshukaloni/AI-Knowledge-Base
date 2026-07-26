import { useNavigate, useParams } from "react-router-dom";
import { useChatList, useDeleteChat } from "@/hooks/useChats";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatSidebar() {
  const { data, isLoading } = useChatList({ limit: 30 });
  const deleteMutation = useDeleteChat();
  const navigate = useNavigate();
  const { chatId } = useParams();

  const chats = data?.data?.chats || [];

  return (
    <aside className="hidden md:flex w-72 flex-col border-r bg-card">
      <div className="p-3">
        <Button className="w-full justify-start" variant="outline" onClick={() => navigate("/chat")}>
          <Plus className="mr-2 h-4 w-4" /> New conversation
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        {isLoading &&
          [...Array(5)].map((_, i) => <Skeleton key={i} className="h-10 mx-1 my-1" />)}

        {!isLoading && chats.length === 0 && (
          <p className="text-sm text-muted-foreground px-3 py-4">No conversations yet</p>
        )}

        {chats.map((chat) => (
          <div
            key={chat._id}
            className={cn(
              "group flex items-center justify-between rounded-md px-3 py-2 text-sm cursor-pointer",
              chatId === chat._id ? "bg-primary text-primary-foreground" : "hover:bg-accent"
            )}
            onClick={() => navigate(`/chat/${chat._id}`)}
          >
            <div className="flex items-center gap-2 min-w-0">
              <MessageSquare className="h-4 w-4 shrink-0" />
              <span className="truncate">{chat.title}</span>
            </div>
            <button
              className="opacity-0 group-hover:opacity-100 shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                deleteMutation.mutate(chat._id);
                if (chatId === chat._id) navigate("/chat");
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </aside>
  );
}
