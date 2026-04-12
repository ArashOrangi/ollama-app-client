"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send } from "lucide-react";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({
  conversationId,
  setConversationId,
}: {
  conversationId: number | null;
  setConversationId: (id: number) => void;
}) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (conversationId) fetchHistory();
    else setMessages([]);
  }, [conversationId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchHistory = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(
      `http://localhost:3001/api/chat/history/${conversationId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    setMessages(res.data);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:3001/api/chat/send",
        {
          conversationId,
          content: input,
          model: "gemma3:1b",
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      if (!conversationId) setConversationId(res.data.conversationId);
      setMessages((prev) => [...prev, res.data.message]);
    } catch (err) {
      alert("Error sending message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && !loading && (
          <div className="h-full flex items-center justify-center text-slate-500">
            How can I help you today?
          </div>
        )}
        {messages.map((m, i) => (
          <MessageBubble key={i} message={m} />
        ))}
        {loading && (
          <div className="text-slate-500 text-sm italic">AI is thinking...</div>
        )}
        <div ref={scrollRef} />
      </div>
      <form
        onSubmit={handleSend}
        className="p-4 border-t border-slate-800 bg-slate-900/50"
      >
        <div className="max-w-3xl mx-auto flex gap-2">
          <input
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="bg-blue-600 p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}
