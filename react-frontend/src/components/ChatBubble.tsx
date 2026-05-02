import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { useAuth } from "../hooks/auth/useAuth";
import { useChat } from "../hooks/chat/useChat";
import { chatApi } from "../api/chatApi";
import { siteConfig } from "../config/siteConfig";

export default function ChatBubble() {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);
    const [chatId, setChatId] = useState<number | null>(null);
    const [input, setInput] = useState("");
    const [starting, setStarting] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);
    const colors = siteConfig.colors;

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
                if (chats.length > 0) {
                    setChatId(chats[0].id);
                } else {
                    const res = await chatApi.createChat();
                    setChatId(res.data.id);
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
            {/* Chat window */}
            {open && (
                <div
                    className="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-2xl shadow-2xl border flex flex-col overflow-hidden"
                    style={{ height: 420 }}
                >
                    {/* Header */}
                    <div
                        className="flex items-center justify-between px-4 py-3 text-white"
                        style={{ background: colors.primarycolor }}
                    >
                        <span className="font-bold">Support Chat</span>
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
                            return (
                                <div
                                    key={i}
                                    className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                                >
                                    <div
                                        className={`px-3 py-2 rounded-xl text-sm max-w-[75%] break-words ${isMe
                                                ? "text-white rounded-br-none"
                                                : "bg-white border text-gray-800 rounded-bl-none"
                                            }`}
                                        style={isMe ? { background: colors.primarycolor } : {}}
                                    >
                                        {msg.content}
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
                            style={{ "--tw-ring-color": colors.primarycolor } as any}
                            disabled={!chatId || starting}
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || !chatId}
                            className="p-2 rounded-lg text-white transition disabled:opacity-40"
                            style={{ background: colors.primarycolor }}
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Floating bubble button */}
            <button
                onClick={open ? () => setOpen(false) : handleOpen}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                style={{ background: colors.primarycolor }}
                aria-label="Open support chat"
            >
                {open ? <X size={24} /> : <MessageCircle size={24} />}
            </button>
        </>
    );
}