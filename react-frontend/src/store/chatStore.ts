import { create } from "zustand";

interface ChatMessage {
  chatId: number;
  senderId: number;
  content: string;
  createdAt: string;
  type?: string;
  read?: boolean;
}

interface ChatStoreState {
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatStoreState>((set) => ({
  messages: [],
  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),
  clearMessages: () => set({ messages: [] }),
}));