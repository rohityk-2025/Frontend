/**
 * NotificationItem
 * Renders a single notification row with minimal design
 */

export default function NotificationItem({ item, onRead }) {
  // Format the date from ISO string to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div
      className={`list-group-item notification-item ${
        !item.read && !item.is_read ? "unread" : ""
      }`}
      onClick={() => onRead(item.id)}
    >
      <div className="d-flex justify-content-between align-items-center">
        <h6 className="fw-semibold mb-0">{item.title}</h6>
        <small className="text-muted ms-2">
          {formatDate(item.created_at || item.time)}
        </small>
      </div>
    </div>
  );
}
