import { useEffect, useCallback } from "react";
import { joinConversation, onReceiveMessage } from "../../services/signalr/chatHub";
import { useChatStore } from "../../store/chatStore";
import { chatApi } from "../../api/chatApi";

export function useChat(chatId: number) {
  const { messages, addMessage, clearMessages } = useChatStore();

  useEffect(() => {
    clearMessages();
    joinConversation(chatId);

    // onReceiveMessage now returns a cleanup fn — no duplicate listeners
    const cleanup = onReceiveMessage((msg) => {
      addMessage(msg);
    });

    return cleanup;
  }, [chatId]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || !chatId) return;
      
      try {
        await chatApi.sendMessage(chatId, content);
      } catch (err: any) {
        const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
        console.error("Send failed:", serverMsg ?? err.message);
        throw err;
      }
    },
    [chatId]
  );

  return { messages, sendMessage };
}