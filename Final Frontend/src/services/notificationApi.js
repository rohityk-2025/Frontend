import api from "./api";

// Get all notifications for logged-in user
export const getNotifications = async () => {
  try {
    const response = await api.get("/notifications");
    // Backend returns { notifications: [...] }
    return response.data.notifications || response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Get count of unread notifications
export const getUnreadCount = async () => {
  try {
    const response = await api.get("/notifications/unread/count");
    return response.data.unreadCount;
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return 0;
  }
};

// Mark single notification as read
export const markAsRead = async (notificationId) => {
  try {
    const response = await api.put(`/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

// Mark all notifications as read
export const markAllAsRead = async () => {
  try {
    const response = await api.put("/notifications");
    return response.data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};

// Delete notification
export const deleteNotification = async (notificationId) => {
  try {
    const response = await api.delete(`/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};
