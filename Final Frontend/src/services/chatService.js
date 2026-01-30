import api from "./api";

// Get all chats for current user
export const getMyChats = async () => {
  const res = await api.get("/chats");
  return res.data;
};

// Start chat (from product detail)
export const startChat = async (listingId, sellerId) => {
  const res = await api.post("/chats/start", {
    listingId,
    sellerId,
  });

  return res.data; // { chatId }
};

// Get messages for a chat
export const getMessages = async (chatId) => {
  const res = await api.get(`/chats/${chatId}/messages`);
  return res.data;
};

// Send a message
export const sendMessage = async (chatId, text) => {
  const res = await api.post(`/chats/${chatId}/messages`, {
    text,
  });

  return res.data;
};
