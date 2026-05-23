import { useState } from "react";
import { apiClient } from "../../api/apiClient";

interface AgentMessage {
    role: string;
    text: string;
}

export default function Test() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<AgentMessage[]>([]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        setMessages((prev) => [...prev, { role: "user", text: input }]);

        const res = await apiClient.post("http://localhost:5000/api/agent/run", {
            input,
        });

        setMessages((prev) => [
            ...prev,
            { role: "assistant", text: res.data.answer },
        ]);

        setInput("");
    };

    return (
        <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
            <h2>AI Agent (Gemini)</h2>

            <div
                style={{
                    border: "1px solid #ddd",
                    padding: 10,
                    height: 300,
                    overflowY: "auto",
                    marginBottom: 10,
                }}
            >
                {messages.map((m, i) => (
                    <div key={i} style={{ marginBottom: 8 }}>
                        <strong>{m.role}:</strong> {m.text}
                    </div>
                ))}
            </div>

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask the agent..."
                style={{ width: "80%", padding: 8 }}
            />
            <button onClick={sendMessage} style={{ padding: 8, marginLeft: 10 }}>
                Send
            </button>
        </div>
    );
}