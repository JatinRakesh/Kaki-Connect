"use client";

import { useEffect, useState } from "react";

type Event = {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  organiser: string;
  capacity: number;
  participants: number;
  image: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [joinedEvents, setJoinedEvents] = useState<number[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const loadEvents = async () => {
    try {
      const response = await fetch("/api/events");

      if (!response.ok) {
        throw new Error("Unable to load events");
      }

      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error("Unable to load events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    const savedEvents = localStorage.getItem("joinedEvents");

    if (savedEvents) {
      setJoinedEvents(JSON.parse(savedEvents));
    }
  }, []);

  const saveJoinedEvents = (newJoinedEvents: number[]) => {
    setJoinedEvents(newJoinedEvents);
    localStorage.setItem("joinedEvents", JSON.stringify(newJoinedEvents));
  };

  const joinEvent = (eventId: number) => {
    if (joinedEvents.includes(eventId)) {
      return;
    }

    saveJoinedEvents([...joinedEvents, eventId]);
  };

  const leaveEvent = async (eventId: number) => {
    try {
      const response = await fetch(
        `/api/events/${eventId}/leave`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      setJoinedEvents((previous) =>
        previous.filter((id) => id !== eventId)
      );

      await loadEvents();

      alert("You have left the event.");
    } catch (error) {
      console.error("Leave event error:", error);

      alert("Unable to leave event");
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(search.toLowerCase()) ||
      event.location.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || event.category === category;

    return matchesSearch && matchesCategory;
  });

  const categories = [
    "All",
    ...Array.from(new Set(events.map((event) => event.category))),
  ];

  return (
    <main style={styles.page}>
      <section style={styles.header}>
        <div>
          <p style={styles.smallHeading}>Kaki Connect</p>

          <h1 style={styles.title}>Discover Events</h1>

          <p style={styles.subtitle}>
            Find activities happening around your neighbourhood and connect
            with your community.
          </p>
        </div>
      </section>

      <section style={styles.filters}>
        <input
          type="text"
          placeholder="Search events or locations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.search}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.select}
        >
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </section>

      <section style={styles.stats}>
        <div>
          <strong>{filteredEvents.length}</strong>
          <span> Events available</span>
        </div>

        <div>
          <strong>{joinedEvents.length}</strong>
          <span> Events joined</span>
        </div>
      </section>

      {filteredEvents.length === 0 ? (
        <div style={styles.empty}>
          <h2>No events found</h2>

          <p>Try changing your search or category.</p>
        </div>
      ) : (
        <section style={styles.grid}>
          {filteredEvents.map((event) => {
            const joined = joinedEvents.includes(event.id);

            const displayedParticipants =
              event.participants + (joined ? 1 : 0);

            const availableSlots =
              event.capacity - displayedParticipants;

            return (
              <article key={event.id} style={styles.card}>
                <img
                  src={event.image}
                  alt={event.title}
                  style={styles.image}
                />

                <div style={styles.cardContent}>
                  <div style={styles.cardTop}>
                    <span style={styles.category}>{event.category}</span>

                    {joined && (
                      <span style={styles.joinedBadge}>Joined ✓</span>
                    )}
                  </div>

                  <h2 style={styles.eventTitle}>{event.title}</h2>

                  <p style={styles.description}>
                    {event.description}
                  </p>

                  <div style={styles.information}>
                    <p>📅 {event.date}</p>
                    <p>🕐 {event.time}</p>
                    <p>📍 {event.location}</p>
                    <p>👥 {displayedParticipants} / {event.capacity} joined</p>
                  </div>

                  <div style={styles.progressBackground}>
                    <div
                      style={{
                        ...styles.progress,
                        width: `${
                          (displayedParticipants / event.capacity) * 100
                        }%`,
                      }}
                    />
                  </div>

                  <p style={styles.slots}>
                    {availableSlots > 0
                      ? `${availableSlots} slots remaining`
                      : "Event full"}
                  </p>

                  <div style={styles.buttons}>
                    <button
                      style={styles.secondaryButton}
                      onClick={() => setSelectedEvent(event)}
                    >
                      View Details
                    </button>

                    {joined ? (
                      <button
                        style={styles.leaveButton}
                        onClick={() => leaveEvent(event.id)}
                      >
                        Leave Event
                      </button>
                    ) : (
                      <button
                        style={{
                          ...styles.joinButton,
                          opacity: availableSlots <= 0 ? 0.5 : 1,
                        }}
                        disabled={availableSlots <= 0}
                        onClick={() => joinEvent(event.id)}
                      >
                        {availableSlots <= 0
                          ? "Event Full"
                          : "Join Event"}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}

      {selectedEvent && (
        <div style={styles.modalBackground}>
          <div style={styles.modal}>
            <button
              style={styles.closeButton}
              onClick={() => setSelectedEvent(null)}
            >
              ×
            </button>

            <img
              src={selectedEvent.image}
              alt={selectedEvent.title}
              style={styles.modalImage}
            />

            <span style={styles.category}>
              {selectedEvent.category}
            </span>

            <h2 style={styles.modalTitle}>
              {selectedEvent.title}
            </h2>

            <p style={styles.description}>
              {selectedEvent.description}
            </p>

            <div style={styles.modalDetails}>
              <p>
                <strong>Date:</strong> {selectedEvent.date}
              </p>

              <p>
                <strong>Time:</strong> {selectedEvent.time}
              </p>

              <p>
                <strong>Location:</strong> {selectedEvent.location}
              </p>

              <p>
                <strong>Organised by:</strong>{" "}
                {selectedEvent.organiser}
              </p>

              <p>
                <strong>Participants:</strong>{" "}
                {selectedEvent.participants +
                  (joinedEvents.includes(selectedEvent.id) ? 1 : 0)}
                {" / "}
                {selectedEvent.capacity}
              </p>
            </div>

            {joinedEvents.includes(selectedEvent.id) ? (
              <button
                style={styles.leaveModalButton}
                onClick={() => leaveEvent(selectedEvent.id)}
              >
                Leave Event
              </button>
            ) : (
              <button
                style={styles.modalJoinButton}
                onClick={() => joinEvent(selectedEvent.id)}
              >
                Join Event
              </button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "50px 24px",
    fontFamily: "Arial, sans-serif",
  },

  header: {
    marginBottom: "32px",
  },

  smallHeading: {
    fontWeight: "bold",
    marginBottom: "8px",
  },

  title: {
    fontSize: "42px",
    margin: "0 0 10px",
  },

  subtitle: {
    margin: 0,
    maxWidth: "650px",
    lineHeight: 1.6,
  },

  filters: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
    flexWrap: "wrap",
  },

  search: {
    flex: 1,
    minWidth: "250px",
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },

  select: {
    padding: "14px 18px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },

  stats: {
    display: "flex",
    gap: "30px",
    marginBottom: "30px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
  },

  card: {
    border: "1px solid #e5e5e5",
    borderRadius: "16px",
    overflow: "hidden",
    background: "white",
    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
  },

  image: {
    width: "100%",
    height: "200px",
    objectFit: "cover",
  },

  cardContent: {
    padding: "20px",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  category: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "20px",
    background: "#eeeeee",
    fontSize: "13px",
    fontWeight: "bold",
  },

  joinedBadge: {
    fontSize: "13px",
    fontWeight: "bold",
  },

  eventTitle: {
    fontSize: "22px",
    marginBottom: "8px",
  },

  description: {
    lineHeight: 1.6,
  },

  information: {
    marginTop: "20px",
    lineHeight: 1.4,
  },

  progressBackground: {
    width: "100%",
    height: "7px",
    borderRadius: "10px",
    background: "#e5e5e5",
    overflow: "hidden",
    marginTop: "18px",
  },

  progress: {
    height: "100%",
    background: "#222",
  },

  slots: {
    fontSize: "13px",
    marginTop: "8px",
  },

  buttons: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },

  secondaryButton: {
    flex: 1,
    padding: "11px",
    borderRadius: "8px",
    border: "1px solid #222",
    background: "white",
    cursor: "pointer",
  },

  joinButton: {
    flex: 1,
    padding: "11px",
    borderRadius: "8px",
    border: "none",
    background: "#222",
    color: "white",
    cursor: "pointer",
  },

  leaveButton: {
    flex: 1,
    padding: "11px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },

  empty: {
    padding: "70px",
    textAlign: "center",
  },

  modalBackground: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    zIndex: 1000,
  },

  modal: {
    background: "white",
    width: "100%",
    maxWidth: "600px",
    maxHeight: "90vh",
    overflowY: "auto",
    padding: "25px",
    borderRadius: "18px",
    position: "relative",
  },

  closeButton: {
    position: "absolute",
    top: "10px",
    right: "15px",
    fontSize: "30px",
    border: "none",
    background: "white",
    cursor: "pointer",
    zIndex: 2,
  },

  modalImage: {
    width: "100%",
    height: "250px",
    objectFit: "cover",
    borderRadius: "12px",
    marginBottom: "20px",
  },

  modalTitle: {
    fontSize: "28px",
  },

  modalDetails: {
    lineHeight: 1.6,
    marginTop: "20px",
  },

  modalJoinButton: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    background: "#222",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "15px",
  },

  leaveModalButton: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "15px",
  },
};