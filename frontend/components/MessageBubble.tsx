export default function MessageBubble({ message }: { message: any }) {
  return (
    <div
      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
    >
      <div className="bg-slate-800 p-3 rounded-lg max-w-lg">
        {message.content && (
          <p className="text-slate-200 whitespace-pre-wrap">
            {message.content}
          </p>
        )}

        {message.file && (
          <div className="mt-2">
            {message.file.match(/\.(jpg|jpeg|png|gif|webp)$/) ? (
              <img src={message.file} className="rounded-lg max-w-xs" />
            ) : (
              <a
                href={message.file}
                target="_blank"
                className="text-blue-400 underline"
              >
                Download File
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
