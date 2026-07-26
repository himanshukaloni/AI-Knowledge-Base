import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { chatService } from "@/services/chatService";
import { useToast } from "@/components/ui/use-toast";

export function useChatList(params = {}) {
  return useQuery({
    queryKey: ["chats", params],
    queryFn: () => chatService.listChats(params),
  });
}

export function useChat(chatId) {
  return useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => chatService.getChat(chatId),
    enabled: !!chatId,
  });
}

export function useDeleteChat() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id) => chatService.deleteChat(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
      toast({ title: "Conversation deleted" });
    },
  });
}
