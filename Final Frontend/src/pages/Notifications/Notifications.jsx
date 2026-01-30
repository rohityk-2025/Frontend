/**
 * Notifications Page
 * - Shows all notifications fetched from API
 * - Mark single / all as read
 */

import { useState, useEffect } from "react";
import NotificationList from "../../components/notifications/NotificationList";
import {
  getNotifications,
  markAsRead as markAsReadApi,
  markAllAsRead as markAllAsReadApi,
} from "../../services/notificationApi";

import "../../components/notifications/Notifications.css";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      console.log("Fetched notifications:", data);
      // Convert API response format to component format
      const formattedNotifications = data.map((notif) => ({
        ...notif,
        read: notif.is_read,
      }));
      setNotifications(formattedNotifications);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Failed to load notifications");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  // Mark single notification as read
  const markAsRead = async (id) => {
    try {
      await markAsReadApi(id);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read: true, is_read: true } : n,
        ),
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  // Mark all notifications as read
  const markAllRead = async () => {
    try {
      await markAllAsReadApi();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true, is_read: true })),
      );
    } catch (err) {
      console.error("Failed to mark all as read:", err);
    }
  };

  if (loading) {
    return (
      <div className="container py-4">
        <p className="text-center text-muted">Loading notifications...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">Notifications</h4>

        {notifications.some((n) => !n.read) && (
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={markAllRead}
          >
            Mark all as read
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No notifications yet
        </div>
      ) : (
        <NotificationList notifications={notifications} onRead={markAsRead} />
      )}
    </div>
  );
}
