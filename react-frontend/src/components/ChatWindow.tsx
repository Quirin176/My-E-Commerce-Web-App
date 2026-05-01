import { useChat } from "../hooks/chat/useChat";

interface ChatWindowProp {
    ChatId: number
}

export default function ChatWindow({ ChatId }: ChatWindowProp) {
  const { messages } = useChat(ChatId);

  return (
    <div>
      {messages.map((m, i) => (
        <div key={i}>
          <strong>{m.senderId}</strong>: {m.content}
        </div>
      ))}
    </div>
  );
}