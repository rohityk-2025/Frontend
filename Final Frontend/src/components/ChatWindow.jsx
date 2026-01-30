import { useState } from "react";
import "./ChatWindow.css";


export default function ChatWindow({ chat, messages, onSend }) {
const [text, setText] = useState("");


if (!chat) {
return <div className="chat-window empty">Select a chat to start</div>;
}


const handleSend = () => {
if (!text.trim()) return;
onSend(text);
setText("");
};


return (
<div className="chat-window">
<div className="chat-header">{chat.name}</div>


<div className="chat-messages">
{messages.map((msg) => (
<div
key={msg.id}
className={`message ${msg.isMine ? "mine" : "theirs"}`}
>
{msg.text}
</div>
))}
</div>


<div className="chat-input">
<input
type="text"
placeholder="Type a message..."
value={text}
onChange={(e) => setText(e.target.value)}
onKeyDown={(e) => e.key === "Enter" && handleSend()}
/>
<button onClick={handleSend}>Send</button>
</div>
</div>
);
}