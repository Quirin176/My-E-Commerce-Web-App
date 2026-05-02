import { useCallback, useEffect, useRef, useState } from "react";
import { chatApi } from "../../../api/chatApi";

export interface MessageResponse {
  id: number,
  chatId: number,
  senderId: number,
  content: string,
  type: string,
  read: boolean,
  createdAt: Date
}

export interface ChatResponse {
  id: number,
  customerId: number,
  adminId: number | null,
  createdAt: Date,
  updatedAt: Date,
  status: string,
  messages: MessageResponse[]
}

export default function AdminChats() {
  const [chats, setChats] = useState<ChatResponse[] | null>(null);
  const [selectedChatId, setSelectedChatId] = useState<number>(0);

  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [sending, setSending] = useState(false);
  const [input, setInput] = useState("");

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const fetchChats = useCallback(async () => {
    const res = await chatApi.getAllChats();
    const data = Array.isArray(res.data) ? res.data : [];
    // console.log(res);
    setChats(data);
  }, []);

  const fetchMessages = useCallback(async () => {
    if (!selectedChatId) return;

    const res = await chatApi.getChatByChatId(selectedChatId);
    const data = Array.isArray(res.data.messages) ? res.data.messages : [];
    console.log(res);
    setMessages(data);
  }, [selectedChatId]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!selectedChatId || input.trim() === "" || sending) return;

    setSending(true);
    try {
      await chatApi.sendMessage(selectedChatId, input);
      setInput("");
      fetchMessages();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="w-full h-193.75 flex border border-gray-600">
      {/* LEFT PANEL - CHAT LIST */}
      <div className="w-1/3 border-r border-gray-700 p-4 flex flex-col gap-2 overflow-y-auto">
        <h2 className="text-xl font-bold mb-3">Chats</h2>

        {chats?.map((chat) => (
          <div
            key={chat.id}
            className={`p-3 rounded cursor-pointer ${selectedChatId === chat.id ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            onClick={() => setSelectedChatId(chat.id)}
          >
            <div className="font-semibold">Customer #{chat.customerId}</div>
            <div className="text-xs text-gray-700">{chat.status}</div>
          </div>
        ))}
      </div>

      {/* RIGHT PANEL - MESSAGES */}
      <div className="w-2/3 p-4 flex flex-col">
        {selectedChatId ? (
          <>
            <h2 className="text-xl font-bold mb-2">Chat #{selectedChatId}</h2>

            {/* MESSAGE WINDOW */}
            <div className="flex-1 overflow-y-auto p-3 bg-gray-100 rounded">
              {messages.length === 0 && (
                <div className="text-gray-500 text-center mt-10">No messages yet</div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`my-2 flex ${msg.senderId === 1 ? "justify-end" : "justify-start"
                    }`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg max-w-xs ${msg.senderId === 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-300 text-black"
                      }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* SEND MESSAGE INPUT */}
            <div className="flex mt-3 gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 p-2 border rounded"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSend}
                disabled={sending}
                className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-500 text-lg mt-10 text-center">
            Select a chat to view messages
          </div>
        )}
      </div>
    </div>
  );
}