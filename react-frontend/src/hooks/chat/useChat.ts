import { useEffect } from "react";
import { onReceiveMessage, joinConversation } from "../../services/signalr/chatHub";
import { useChatStore } from "../../store/chatStore";

export function useChat(ChatId: number) {
  const addMessage = useChatStore((s) => s.addMessage);

  useEffect(() => {
    joinConversation(ChatId);

    onReceiveMessage((msg) => {
      addMessage(msg);
    });
  }, [ChatId]);

  return {
    messages: useChatStore((s) => s.messages)
  };
}