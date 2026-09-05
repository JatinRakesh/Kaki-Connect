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
  image?: string | null;
  joinedAt: string;
};

export default function MyEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    try {
      const response = await fetch("/api/my-events");

      if (!response.ok) {
        throw new Error("Unable to load events");
      }

      const data = await response.json();

      setEvents(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

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

      alert("You have left the event.");

      loadEvents();
    } catch (error) {
      console.error(error);

      alert("Unable to leave event");
    }
  };

  if (loading) {
    return (
      <main style={{ padding: "40px" }}>
        <p>Loading your events...</p>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "50px 24px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>My Events</h1>

      <p>Events that you have joined.</p>

      {events.length === 0 ? (
        <div
          style={{
            marginTop: "40px",
            textAlign: "center",
          }}
        >
          <h2>You haven't joined any events yet.</h2>

          <a href="/events">
            Discover Events
          </a>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "20px",
            marginTop: "30px",
          }}
        >
          {events.map((event) => (
            <div
              key={event.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "15px",
                overflow: "hidden",
              }}
            >
              {event.image && (
                <img
                  src={event.image}
                  alt={event.title}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                  }}
                />
              )}

              <div style={{ padding: "20px" }}>
                <h2>{event.title}</h2>

                <p>{event.description}</p>

                <p>
                  📅 {event.date}
                </p>

                <p>
                  🕐 {event.time}
                </p>

                <p>
                  📍 {event.location}
                </p>

                <button
                  onClick={() => leaveEvent(event.id)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    marginTop: "15px",
                    cursor: "pointer",
                  }}
                >
                  Leave Event
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}