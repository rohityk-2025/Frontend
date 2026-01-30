/**
 * NotificationList
 * Loops over notifications and renders NotificationItem
 */

import NotificationItem from "./NotificationItem";

export default function NotificationList({ notifications, onRead }) {
  return (
    <div className="list-group shadow-sm rounded">
      {notifications.map((item) => (
        <NotificationItem key={item.id} item={item} onRead={onRead} />
      ))}
    </div>
  );
}
