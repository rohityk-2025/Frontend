// TODO: Implement this file
import "./ChatList.css";


export default function ChatList({ chats, selectedChatId, onSelect }) {
return (
<div className="chat-list">
{chats.map((chat) => (
<div
key={chat.id}
className={`chat-item ${selectedChatId === chat.id ? "active" : ""}`}
onClick={() => onSelect(chat)}
>
<img src={chat.avatar || "https://i.pravatar.cc/50"} alt="user" />
<div className="chat-info">
<h4>{chat.name}</h4>
<p>{chat.lastMessage || "No messages yet"}</p>
</div>
</div>
))}
</div>
);
}