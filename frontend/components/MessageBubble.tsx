export default function MessageBubble({ message }: { message: any }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] p-3 rounded-2xl ${
          isUser
            ? "bg-blue-600 text-white rounded-tr-none"
            : "bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700"
        }`}
      >
        <p
          dir="auto"
          style={{ unicodeBidi: "plaintext" }}
          className="text-sm whitespace-pre-wrap"
        >
          {message.content}
        </p>
      </div>
    </div>
  );
}
