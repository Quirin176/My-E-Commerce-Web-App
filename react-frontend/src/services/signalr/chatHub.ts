import { connection } from "./signalrConnection";

export function joinConversation(conversationId: number) {
  connection.invoke("JoinConversation", conversationId)
    .catch(err => console.error("JoinConversation error:", err));
}

export function sendMessage(conversationId: number, senderId: number, content: string) {
  connection.invoke("SendMessage", conversationId, senderId, content)
    .catch(err => console.error("SendMessage error:", err));
}

export function onReceiveMessage(callback: (msg: any) => void) {
  connection.on("ReceiveMessage", callback);
}