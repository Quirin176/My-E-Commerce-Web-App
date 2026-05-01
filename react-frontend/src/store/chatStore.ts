import { create } from "zustand";

export const useChatStore = create((set) => ({
  messages: [],
  addMessage: (msg: string) => set((state) => ({
    messages: [...state.messages, msg]
  }))
}));