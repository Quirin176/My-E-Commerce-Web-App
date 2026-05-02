import { apiClient } from "./apiClient";

export const chatApi = {

    // Create an message
    async sendMessage(chatId: number, content: string) {
        try {
            await apiClient.post("/messages", { chatId, content });
        } catch (err: any) {
            const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
            console.error("Send failed:", serverMsg ?? err.message);
            throw err;
        }
    },

    // Get chat by Chat Id
    async getChatByChatId(chatId: number) {
        try {
            const res = await apiClient.get(`/chats/${chatId}`);
            return res;
        } catch (err: any) {
            const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
            console.error("Send failed:", serverMsg ?? err.message);
            throw err;
        }
    },

    // Admin get all chats
    async getMyChat() {
        try {
            const res = await apiClient.get("/chats/mine");
            return res;
        } catch (err: any) {
            const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
            console.error("Send failed:", serverMsg ?? err.message);
            throw err;
        }
    },

    // Admin get all chats
    async getAllChats() {
        try {
            const res = await apiClient.get("/chats");
            return res;
        } catch (err: any) {
            const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
            console.error("Send failed:", serverMsg ?? err.message);
            throw err;
        }
    },

    // Admin get all chats
    async createChat() {
        try {
            const res = await apiClient.post("/chats");
            return res;
        } catch (err: any) {
            const serverMsg = err?.response?.data?.message || err?.response?.data?.error;
            console.error("Send failed:", serverMsg ?? err.message);
            throw err;
        }
    },
};
