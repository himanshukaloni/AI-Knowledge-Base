import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import ChatSidebar from "@/components/chat/ChatSidebar";
import MessageBubble from "@/components/chat/MessageBubble";
import ChatInput from "@/components/chat/ChatInput";
import SuggestedQuestions from "@/components/chat/SuggestedQuestions";
import { useChat } from "@/hooks/useChats";
import { chatService } from "@/services/chatService";
import { useToast } from "@/components/ui/use-toast";

export default function Chat() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: chatData } = useChat(chatId);
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef(null);

  // Load full history whenever the active chat changes
  useEffect(() => {
    if (chatData?.data?.chat) {
      const loaded = chatData.data.chat.messages.flatMap((m) => [
        { role: "user", content: m.question },
        { role: "assistant", content: m.answer, sources: m.sources },
      ]);
      setMessages(loaded);
    } else if (!chatId) {
      setMessages([]);
    }
  }, [chatData, chatId]);

  // Auto-scroll to bottom whenever messages change or streaming updates
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (question) => {
    setMessages((prev) => [...prev, { role: "user", content: question }, { role: "assistant", content: "" }]);
    setIsStreaming(true);

    let currentChatId = chatId;

    await chatService.askStream(
      { question, chatId: currentChatId },
      {
        onToken: (token) => {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...updated[updated.length - 1],
              content: updated[updated.length - 1].content + token,
            };
            return updated;
          });
        },
        onDone: (sources, newChatId) => {
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { ...updated[updated.length - 1], sources };
            return updated;
          });
          setIsStreaming(false);
          queryClient.invalidateQueries({ queryKey: ["chats"] });
          queryClient.invalidateQueries({ queryKey: ["dashboard"] });
          if (!currentChatId && newChatId) {
            navigate(`/chat/${newChatId}`, { replace: true });
          }
        },
        onError: (error) => {
          setIsStreaming(false);
          toast({
            variant: "destructive",
            title: "Failed to get a response",
            description: error.message,
          });
        },
      }
    );
  };

  const handleRegenerate = (index) => {
    // The question is the user message immediately preceding this assistant message
    const question = messages[index - 1]?.content;
    if (!question) return;
    setMessages((prev) => prev.slice(0, index)); // drop the old answer
    sendMessage(question);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <ChatSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 sm:p-6">
          {messages.length === 0 ? (
            <SuggestedQuestions onSelect={sendMessage} />
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map((m, i) => (
                <MessageBubble
                  key={i}
                  role={m.role}
                  content={m.content}
                  sources={m.sources}
                  isStreaming={isStreaming && i === messages.length - 1 && m.role === "assistant"}
                  onRegenerate={
                    m.role === "assistant" && i === messages.length - 1 && !isStreaming
                      ? () => handleRegenerate(i)
                      : undefined
                  }
                />
              ))}
            </div>
          )}
        </div>

        <ChatInput onSend={sendMessage} disabled={isStreaming} />
      </div>
    </div>
  );
}
