export default function ChatBubble({ message }) {
  return (
    <div className={`chat-bubble ${message.from === "me" ? "me" : "seller"}`}>
      <p>{message.text}</p>
      <span className="time">{message.time}</span>
    </div>
  );
}
