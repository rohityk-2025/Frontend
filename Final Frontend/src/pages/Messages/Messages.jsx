

import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import api from "../../services/api";
import { toast } from "react-toastify";

import ChatListItem from "../../components/messages/ChatListItem";
import ChatBubble from "../../components/messages/ChatBubble";

import "./Messages.css";

export default function Messages() {
  const location = useLocation();
  const chatFromProduct = location.state?.chatId;

  const user = JSON.parse(localStorage.getItem("user"));

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Menu visibility state
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch all chats on mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        // API request: get all chats
        const res = await api.get("/messages");

        const fixedChats = res.data.map((chat) => ({
          ...chat,
          otherUser: {
            id: chat.other_id,
            name: chat.other_name,
            avatar: chat.other_avatar,
          },
        }));

        setChats(fixedChats);

        if (chatFromProduct) {
          const found = fixedChats.find(
            (c) => String(c.id) === String(chatFromProduct),
          );
          if (found) setActiveChat(found);
        } else if (fixedChats.length > 0) {
          setActiveChat(fixedChats[0]);
        }
      } catch (err) {
        console.error("❌ FETCH CHATS ERROR:", err);

        const status = err.response?.status;
        const message = err.response?.data?.message;

        toast.error(
          `Failed to load chats (${status || "NO STATUS"}): ${
            message || err.message
          }`,
        );
      }
    };

    fetchChats();
  }, [chatFromProduct]);

  // Poll messages for the active chat
  useEffect(() => {
    if (!activeChat || !activeChat.id) return;

    const fetchMessages = async () => {
      try {
        // API request: get messages for chat
        const res = await api.get(`/messages/${activeChat.id}/messages`);
        setMessages(res.data);
      } catch (err) {
        console.error("❌ FETCH MESSAGES ERROR:", err);

        const status = err.response?.status;
        const message = err.response?.data?.message;

        toast.error(
          `Failed to load messages (${status || "NO STATUS"}): ${
            message || err.message
          }`,
        );
      }
    };

    fetchMessages();

    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [activeChat]);

  // Send a new message for the active chat
  const handleSend = async () => {
    if (!newMessage.trim() || !activeChat) return;

    try {
      // API request: post new message
      const res = await api.post(`/messages/${activeChat.id}/messages`, {
        message: newMessage,
      });

      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("❌ SEND MESSAGE ERROR:", err);

      const status = err.response?.status;
      const message = err.response?.data?.message;

      toast.error(
        `Send failed (${status || "NO STATUS"}): ${message || err.message}`,
      );
    }
  };

  // Delete the currently selected chat
  const handleDeleteChat = async () => {
    if (!activeChat) return;

    const confirm = window.confirm(
      "Are you sure you want to delete this chat?",
    );
    if (!confirm) return;

    try {
      // API request: delete chat
      await api.delete(`/messages/${activeChat.id}`);

      toast.success("Chat deleted");

      // REMOVE FROM SIDEBAR
      setChats((prev) => prev.filter((c) => c.id !== activeChat.id));

      // CLEAR CHAT WINDOW
      setActiveChat(null);
      setMessages([]);
    } catch (err) {
      console.error("❌ DELETE CHAT ERROR:", err);

      const status = err.response?.status;
      const message = err.response?.data?.message;

      toast.error(
        `Delete failed (${status || "NO STATUS"}): ${message || err.message}`,
      );
    }
  };

  return (
    <div className="chat-root">
      {/* Left sidebar */}
      <div className="chat-sidebar">
        {chats.length === 0 ? (
          <p style={{ padding: "10px" }}>No chats yet</p>
        ) : (
          chats.map((chat) => (
            <ChatListItem
              key={chat.id}
              chat={chat}
              active={activeChat?.id === chat.id}
              onClick={() => setActiveChat(chat)}
            />
          ))
        )}
      </div>

      {/* Main chat window */}
      <div className="chat-main">
        {!activeChat ? (
          <div style={{ padding: "20px" }}>Select a chat</div>
        ) : (
          <>
            {/* Chat header */}
            <div className="chat-top">
              {activeChat.otherUser && (
                <div
                  className="chat-user"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  {/* LEFT — USER INFO */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <img
                      src={
                        activeChat.otherUser.avatar
                          ? activeChat.otherUser.avatar.startsWith("/uploads")
                            ? `http://localhost:8080${activeChat.otherUser.avatar}`
                            : activeChat.otherUser.avatar
                          : "/profile.png"
                      }
                      alt="user"
                      className="chat-avatar"
                    />
                    <span className="chat-username">
                      {activeChat.otherUser.name}
                    </span>
                  </div>

                  {/* RIGHT — THREE DOT MENU */}
                  <div className="chat-menu" ref={menuRef}>
                    <button onClick={() => setShowMenu((prev) => !prev)}>
                      <i className="fa-solid fa-ellipsis-vertical"></i>
                    </button>

                    {showMenu && (
                      <div className="chat-menu-box">
                        <button
                          className="delete-btn"
                          onClick={() => {
                            setShowMenu(false);
                            handleDeleteChat();
                          }}
                        >
                          <i className="fa-solid fa-trash"></i>
                          Delete Chat
                        </button>

                        <button
                          className="cancel-btn"
                          onClick={() => setShowMenu(false)}
                        >
                          <i className="fa-solid fa-xmark"></i>
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Messages list */}
            <div className="chat-body">
              {messages.map((msg) => (
                <ChatBubble
                  key={msg.id}
                  message={{
                    from: msg.sender_id === user.id ? "me" : "other",
                    text: msg.message,
                    time: msg.created_at
                      ? new Date(msg.created_at).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "",
                  }}
                />
              ))}
            </div>

            {/* Message input */}
            <div className="chat-bottom">
              <input
                className="chat-input"
                type="text"
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />

              <button className="send-btn" onClick={handleSend}>
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
