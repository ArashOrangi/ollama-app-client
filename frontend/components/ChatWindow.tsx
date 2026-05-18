"use client";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, Paperclip } from "lucide-react";
import MessageBubble from "./MessageBubble";
import { API_URL } from "./statics";

// -----------------------------
// Model Selector
// -----------------------------
function ModelSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (m: string) => void;
}) {
  const [models, setModels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}models`)
      .then((res) => {
        setModels(res.data.models);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="text-slate-400 text-sm">Loading models...</p>;

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-slate-800 border border-slate-600 text-slate-200 px-2 py-1 rounded"
      dir="ltr"
    >
      {models.map((m) => (
        <option key={m} value={m}>
          {m}
        </option>
      ))}
    </select>
  );
}

// -----------------------------
//    MAIN ChatWindow Component
// -----------------------------
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

  const [file, setFile] = useState<File | null>(null); // ← file

  const [model, setModel] = useState("llama3"); // default model
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load conversation history
  useEffect(() => {
    if (conversationId) fetchHistory();
    else setMessages([]);
  }, [conversationId]);

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch chat history
  const fetchHistory = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`${API_URL}chat/history/${conversationId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessages(res.data);
  };

  // Upload File
  const uploadFile = async () => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");

    const res = await axios.post(`${API_URL}upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    setFile(null);
    return res.data.url; //download link
  };

  // Send Message
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!input.trim() && !file) || loading) return;

    setLoading(true);

    let fileUrl: string | null = null;
    if (file) {
      fileUrl = await uploadFile();
    }

    const messageContent = fileUrl ? `${input}\n\nFile: ${fileUrl}` : input;

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        content: input,
        file: fileUrl,
      },
    ]);

    setInput("");

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${API_URL}chat/send`,
        {
          conversationId,
          content: input,
          file: fileUrl,
          model,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      // set conversation id if needed
      if (!conversationId) setConversationId(res.data.conversationId);

      setMessages((prev) => [...prev, res.data.message]);
    } catch (err) {
      console.error(err);
      alert("Error sending message");
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="flex-1 flex flex-col bg-slate-900 relative">
      {/* Model Selector */}
      <div className="p-3 border-b border-slate-800 bg-slate-800/40 flex items-center gap-3">
        <span className="text-slate-300 text-sm">Model:</span>
        <ModelSelector value={model} onChange={setModel} />
      </div>

      {/* Messages */}
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

      {/* Input & File Upload */}
      <form
        onSubmit={handleSend}
        className="p-4 border-t border-slate-800 bg-slate-900/50"
      >
        <div className="max-w-3xl mx-auto flex gap-2 items-center">
          {/* File Input */}
          <label className="cursor-pointer text-slate-300 hover:text-white">
            <Paperclip size={22} />
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                if (e.target.files) setFile(e.target.files[0]);
              }}
            />
          </label>

          {/* Show selected file */}
          {file && <span className="text-xs text-slate-400">{file.name}</span>}

          {/* Text Input */}
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
