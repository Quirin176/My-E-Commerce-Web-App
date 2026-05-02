import { connection, ensureConnected } from "./signalrConnection";

export async function joinConversation(conversationId: number) {
  await ensureConnected();
  connection.invoke("JoinConversation", conversationId)
    .catch((err) => console.error("JoinConversation error:", err));
}

export async function sendMessageViaHub(
  conversationId: number,
  senderId: number,
  content: string
) {
  await ensureConnected();
  connection.invoke("SendMessage", conversationId, senderId, content)
    .catch((err) => console.error("SendMessage error:", err));
}

// Returns a cleanup function — call it in useEffect return
export function onReceiveMessage(callback: (msg: any) => void): () => void {
  connection.on("ReceiveMessage", callback);
  return () => connection.off("ReceiveMessage", callback);
}