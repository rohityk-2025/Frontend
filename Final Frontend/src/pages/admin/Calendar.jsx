import { useState, useEffect } from "react";
import {
  getEventsByDate,
  addEvent,
  deleteEvent,
} from "../../services/adminApi";
import "./Calendar.css";

export default function Calendar() {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDate, setSelectedDate] = useState(formatDate(today));
  const [events, setEvents] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function formatDate(date) {
    return date.toISOString().split("T")[0];
  }

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();

  const daysArray = [];
  for (let i = 0; i < firstDay; i++) daysArray.push(null);
  for (let day = 1; day <= totalDays; day++) daysArray.push(day);

  /* Load events for selected date */
  useEffect(() => {
    loadEvents(selectedDate);
  }, [selectedDate]);

  const loadEvents = async (date) => {
    try {
      const data = await getEventsByDate(date);
      setEvents(data);
    } catch (err) {
      console.log("Failed to load events", err);
    }
  };

  /* 🔹 ADD EVENT */
  const handleAddEvent = async () => {
    if (!title) return alert("Title required");

    try {
      await addEvent({
        title,
        event_date: selectedDate,
        description,
      });

      setTitle("");
      setDescription("");
      setShowForm(false);
      loadEvents(selectedDate);
    } catch (err) {
      alert("Failed to add event");
    }
  };

  /* 🔹 DELETE EVENT */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    try {
      await deleteEvent(id);
      loadEvents(selectedDate);
    } catch (err) {
      alert("Failed to delete event");
    }
  };

  return (
    <div className="calendar-layout">
      {/* ===== LEFT / MIDDLE PANEL – EVENTS LIST ===== */}
      <div className="events-panel-modern">
        <div className="events-header">
          <h2>Upcoming Events</h2>

          <button
            className="add-event-main-btn"
            onClick={() => setShowForm(true)}
          >
            ＋
          </button>
        </div>

        <p className="selected-date-text">
          Events on <strong>{selectedDate}</strong>
        </p>

        {events.length === 0 ? (
          <div className="no-events-box">
            <p>No events for this day</p>
            <button className="add-empty-btn" onClick={() => setShowForm(true)}>
              + Add Event
            </button>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="event-card-modern">
              <div>
                <h4>{event.title}</h4>
                <p>{event.description}</p>
              </div>

              <button
                className="delete-event-btn"
                onClick={() => handleDelete(event.id)}
              >
                ✖
              </button>
            </div>
          ))
        )}
      </div>

      {/* ===== RIGHT PANEL – CALENDAR ===== */}
      <div className="calendar-panel-modern">
        <div className="calendar-header-modern">
          <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}>
            ◀
          </button>

          <h3>
            {currentDate.toLocaleString("default", { month: "long" })} {year}
          </h3>

          <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}>
            ▶
          </button>
        </div>

        <div className="calendar-days-modern">
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>

        <div className="calendar-grid-modern">
          {daysArray.map((day, index) => {
            if (!day) return <div key={index} className="empty"></div>;

            const fullDate = `${year}-${String(month + 1).padStart(
              2,
              "0",
            )}-${String(day).padStart(2, "0")}`;

            return (
              <div
                key={index}
                className={`calendar-date-modern ${
                  selectedDate === fullDate ? "active" : ""
                }`}
                onClick={() => setSelectedDate(fullDate)}
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== ADD EVENT MODAL ===== */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-box-modern">
            <h3>Add Event</h3>
            <p>Date: {selectedDate}</p>

            <input
              type="text"
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className="modal-actions-modern">
              <button className="save-btn" onClick={handleAddEvent}>
                Save
              </button>
              <button className="cancel-btn" onClick={() => setShowForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
