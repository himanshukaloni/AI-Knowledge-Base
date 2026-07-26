import api from "./api";

export const chatService = {
  ask: (data) => api.post("/chats/ask", data).then((r) => r.data),
  listChats: (params) => api.get("/chats", { params }).then((r) => r.data),
  getChat: (id) => api.get(`/chats/${id}`).then((r) => r.data),
  deleteChat: (id) => api.delete(`/chats/${id}`).then((r) => r.data),

  /**
   * Streaming ask via fetch + ReadableStream (SSE-style), since axios does
   * not support reading a streaming response body incrementally.
   * Calls onToken(text) for each streamed chunk and onDone(sources, chatId)
   * once the stream completes.
   */
  askStream: async ({ question, chatId }, { onToken, onDone, onError }) => {
    const token = localStorage.getItem("token");
    const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

    const response = await fetch(`${baseURL}/chats/ask/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ question, chatId }),
    });

    if (!response.ok || !response.body) {
      onError?.(new Error("Failed to reach the server"));
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const events = buffer.split("\n\n");
      buffer = events.pop(); // keep incomplete trailing event for next chunk

      for (const rawEvent of events) {
        const lines = rawEvent.split("\n");
        const eventLine = lines.find((l) => l.startsWith("event:"));
        const dataLine = lines.find((l) => l.startsWith("data:"));
        if (!eventLine || !dataLine) continue;

        const eventType = eventLine.replace("event:", "").trim();
        const data = JSON.parse(dataLine.replace("data:", "").trim());

        if (eventType === "token") onToken?.(data.token);
        if (eventType === "done") onDone?.(data.sources, data.chatId);
        if (eventType === "error") onError?.(new Error(data.message));
      }
    }
  },
};
