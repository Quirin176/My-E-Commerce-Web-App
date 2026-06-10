import { useState, useRef, useEffect } from "react";
import { Bot, MessageCircle, X, Send } from "lucide-react";
import { useAuth } from "../hooks/auth/useAuth";
import { useChat } from "../hooks/chat/useChat";
import { chatApi } from "../api/chatApi";
import { useChatStore } from "../store/chatStore";

const BOT_SENDER_ID = 1;

export default function ChatBubble() {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [chatId, setChatId] = useState<number | null>(null);
    const [input, setInput] = useState("");
    const [starting, setStarting] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    const { setMessages } = useChatStore();

    if (!user || user.role !== "Customer") return null;

    const { messages, sendMessage } = useChat(chatId ?? 0);

    // Auto-scroll to latest message
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleOpen = async () => {
        setOpen(true);
        if (!chatId) {
            setStarting(true);
            try {
                // Create or resume a chat session
                const existing = await chatApi.getMyChat();
                const chats = existing.data;

                let resolvedChatId: number;

                if (chats.length > 0) {
                    resolvedChatId = chats[0].id;
                    setChatId(resolvedChatId);

                    // Load history from DB into the store
                    const chatDetail = await chatApi.getChatByChatId(resolvedChatId);
                    const history = chatDetail?.data?.messages ?? [];
                    if (history.length > 0) {
                        setMessages(history);
                    }
                } else {
                    const res = await chatApi.createChat();
                    resolvedChatId = res.data.id;
                    setChatId(resolvedChatId);
                }
            } catch (err) {
                console.error("Failed to init chat:", err);
            } finally {
                setStarting(false);
            }
        }
    };

    const handleSend = async () => {
        if (!input.trim() || !chatId) return;
        await sendMessage(input.trim());
        setInput("");
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {open && (
                <div
                    className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden"
                    style={{ height: 420 }}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 text-white bg-(--brand-primary)">
                        <div className="flex items-center gap-2">
                            <Bot size={18} />
                            <span className="font-bold">Support Chat</span>
                        </div>
                        <button onClick={() => setOpen(false)} className="hover:opacity-75 transition">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-gray-50">
                        {starting && (
                            <p className="text-center text-sm text-gray-400">Connecting...</p>
                        )}
                        {!starting && messages.length === 0 && (
                            <p className="text-center text-sm text-gray-400">
                                Send a message to start chatting with support.
                            </p>
                        )}
                        {messages.map((msg, i) => {
                            const isMe = msg.senderId === user.id;
                            const isBot = msg.senderId === BOT_SENDER_ID;

                            return (
                                <div
                                    key={i}
                                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                >
                                    {/* Bot avatar */}
                                    {isBot && (
                                        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mr-1 mt-1 bg-(--brand-primary)">
                                            <Bot size={13} color="white" />
                                        </div>
                                    )}

                                    <div className="flex flex-col gap-0.5 max-w-[75%]">
                                        {isBot && (
                                            <span className="text-[10px] text-gray-400 ml-1">AI Assistant</span>
                                        )}
                                        <div
                                            className={`px-3 py-2 rounded-xl text-sm wrap-break-word ${isMe ? "text-white bg-(--brand-primary) rounded-br-none"
                                                : isBot ? "bg-blue-50 border border-blue-100 text-gray-800 rounded-bl-none"
                                                    : "bg-white border text-gray-800 rounded-bl-none"
                                                }`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="flex items-center gap-2 px-3 py-2 border-t bg-white">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message…"
                            className="flex-1 text-sm px-3 py-2 border rounded-lg outline-none focus:ring-2"
                            disabled={!chatId || starting}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || !chatId}
                            className="p-2 rounded-lg text-white bg-(--brand-primary) transition disabled:opacity-40"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Floating bubble */}
            <button
                onClick={open ? () => setOpen(false) : handleOpen}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg text-white bg-(--brand-primary) flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                aria-label="Open support chat"
            >
                {open ? <X size={24} /> : <MessageCircle size={24} />}
            </button>
        </>
    );
}