"use client";

import { useMemo, useState } from "react";

type Venue = {
  id: string;
  name: string;
  location: string;
  area: string;
  accent: "coral" | "lime" | "lavender" | "sky" | "sand";
  description: string;
  highlights: string[];
  facilities: string[];
};

const venues: Venue[] = [
  {
    id: "chong-pang",
    name: "Chong Pang Community Club",
    location: "128 Yishun Street 11 · New Chong Pang City Hub",
    area: "Yishun",
    accent: "coral",
    description: "A flexible home for big celebrations, sports sessions and creative classes.",
    highlights: ["Multi-Purpose Hall", "Dance Studio", "Outdoor basketball"],
    facilities: ["Main Hall (air-conditioned)", "Badminton Courts 1–3", "Outdoor Basketball Court", "Activity Rooms 1–3", "Conference / Meeting Room", "Classrooms 1–2", "Dance Studio"],
  },
  {
    id: "nee-soon-east",
    name: "Nee Soon East Community Club",
    location: "1 Yishun Avenue 9",
    area: "Yishun",
    accent: "lime",
    description: "Gather, play or learn in a community hub with indoor and outdoor options.",
    highlights: ["Multi-Purpose Hall", "Futsal Court", "Culinary Studio"],
    facilities: ["Multi-Purpose Hall (air-conditioned)", "Sheltered Hardcourt / Plaza", "Indoor Badminton Courts 1–3", "Futsal Court", "Outdoor Basketball Court", "Activity Rooms 1–2", "Conference Room", "Culinary / Cooking Studio", "Study / Reading Room"],
  },
  {
    id: "nee-soon-south",
    name: "Nee Soon South Community Club",
    location: "Blk 844 Yishun Street 81",
    area: "Yishun",
    accent: "lavender",
    description: "A place for performances, practice, sports and hands-on community gatherings.",
    highlights: ["Theatrette", "Music practice", "Culinary Studio"],
    facilities: ["Multi-Purpose Hall (air-conditioned)", "Theatrette with AV system", "Indoor Badminton Courts 1–3", "Dance Studio", "Activity Rooms 1–2", "Karaoke / Music Practice Room", "Culinary Studio"],
  },
  {
    id: "nee-soon-central",
    name: "Nee Soon Central Community Centre",
    location: "1 Northpoint Drive, Northpoint City South Wing #01-201",
    area: "Northpoint",
    accent: "sky",
    description: "An easy central spot for meetings, workshops and small community events.",
    highlights: ["Function Hall", "Training Room", "Foyer space"],
    facilities: ["Multi-Purpose Function Hall", "Function Room", "Common Area Seating & Foyer", "Activity Room", "Conference / Meeting Room", "Training / Seminar Room"],
  },
  {
    id: "nee-soon-link",
    name: "Nee Soon Link Community Centre",
    location: "Blk 413 Yishun Ring Road #01-1887",
    area: "Yishun",
    accent: "sand",
    description: "Neighbourhood-scale rooms and open spaces for informal meet-ups and local activities.",
    highlights: ["Activity Rooms", "Sheltered Pavilion", "Open spaces"],
    facilities: ["Activity Room 1", "Activity Room 2", "Multi-Purpose Void Deck", "Sheltered Pavilion", "Bookable BTO open spaces"],
  },
];

const filters = ["All spaces", "Halls & events", "Sports", "Workshops & classes", "Meetings"];

export default function Home() {
  const [filter, setFilter] = useState("All spaces");
  const [query, setQuery] = useState("");
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [selectedFacility, setSelectedFacility] = useState("");
  const [notice, setNotice] = useState("");

  const shownVenues = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return venues.filter((venue) => {
      const matchesSearch = !needle || `${venue.name} ${venue.location} ${venue.description} ${venue.facilities.join(" ")}`.toLowerCase().includes(needle);
      const matchesFilter = filter === "All spaces" ||
        (filter === "Halls & events" && venue.facilities.some((item) => /hall|theatrette|plaza|pavilion|void deck/i.test(item))) ||
        (filter === "Sports" && venue.facilities.some((item) => /court|futsal|badminton/i.test(item))) ||
        (filter === "Workshops & classes" && venue.facilities.some((item) => /studio|classroom|activity room|culinary/i.test(item))) ||
        (filter === "Meetings" && venue.facilities.some((item) => /meeting|conference|training|seminar|reading/i.test(item)));
      return matchesSearch && matchesFilter;
    });
  }, [filter, query]);

  function submitBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedFacility) {
      setNotice("Please choose the facility you would like to book.");
      return;
    }
    setSelectedVenue(null);
    setNotice(`Booking request for ${selectedFacility} sent. The venue team will be in touch shortly.`);
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Kaki Connect home"><span>K</span><b>Kaki Connect</b></a>
        <nav aria-label="Main navigation">
          <a className="active" href="#top">Explore</a>
          <a href="#spaces">Spaces</a>
          <a href="#how-it-works">How it works</a>
        </nav>
        <button className="host-button" onClick={() => document.getElementById("spaces")?.scrollIntoView({ behavior: "smooth" })}>Book a space <span>↗</span></button>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow">Yishun&apos;s community space guide</p>
          <h1>Make space<br />for good things.</h1>
          <p className="hero-text">Find halls, courts, studios and rooms for your next class, gathering, game or community idea.</p>
          <div className="hero-actions">
            <a className="primary" href="#spaces">Explore spaces <span>↓</span></a>
            <a className="text-button" href="#how-it-works">How booking works <span>→</span></a>
          </div>
          <div className="hero-stats"><span><b>5</b> community hubs</span><span><b>30+</b> spaces to discover</span></div>
        </div>

        <div className="hero-art" aria-hidden="true">
          <div className="scene-backdrop" /><div className="scene-sun" />
          <div className="scene-table"><span /><span /><span /></div>
          <div className="person person-one"><i /><b /><em /></div>
          <div className="person person-two"><i /><b /><em /></div>
          <div className="person person-three"><i /><b /><em /></div>
          <div className="scene-plant"><i /><i /><i /></div>
          <span className="scene-spark spark-one">✦</span><span className="scene-spark spark-two">✦</span>
        </div>
      </section>

      <section className="intro-strip"><p><span>✦</span> From townhalls to badminton games, there&apos;s a corner of Yishun for your next idea.</p></section>

      <section className="browse" id="spaces" aria-labelledby="spaces-heading">
        <div className="section-heading"><div><p className="eyebrow">Find your place</p><h2 id="spaces-heading">Spaces for every kind of gathering.</h2></div><p className="muted">Browse by venue, activity or facility.</p></div>
        <div className="tools">
          <label><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a venue, court, hall or room" aria-label="Search community spaces" /></label>
        </div>
        <div className="filter-row" aria-label="Filter spaces">{filters.map((item) => <button key={item} className={filter === item ? "selected" : ""} onClick={() => setFilter(item)}>{item}</button>)}</div>

        <div className="venue-grid">
          {shownVenues.map((venue, index) => <article className={`venue-card ${venue.accent}`} key={venue.id}>
            <div className="venue-art"><span>{String(index + 1).padStart(2, "0")}</span><i>✦</i></div>
            <div className="venue-content"><p className="eyebrow">{venue.area}</p><h3>{venue.name}</h3><p className="location">⌖ {venue.location}</p><p className="venue-description">{venue.description}</p><div className="tag-list">{venue.highlights.map((highlight) => <span key={highlight}>{highlight}</span>)}</div><button className="card-action" onClick={() => { setSelectedVenue(venue); setSelectedFacility(""); }}>View facilities <span>→</span></button></div>
          </article>)}
        </div>
        {shownVenues.length === 0 && <p className="empty">No spaces match that search. Try “hall”, “court”, or “studio”.</p>}
      </section>

      <section className="how" id="how-it-works"><p className="eyebrow">Simple from start to finish</p><h2>Bring your people together.</h2><div className="steps"><div><b>01</b><h3>Find a space</h3><p>Browse the facilities that suit your plan.</p></div><div><b>02</b><h3>Send a request</h3><p>Choose a venue and tell us about your event.</p></div><div><b>03</b><h3>Make it happen</h3><p>Hear back from the venue team and get together.</p></div></div></section>

      <footer><a className="brand" href="#top"><span>K</span><b>Kaki Connect</b></a><p>Made for people who make the neighbourhood happen.</p></footer>

      {selectedVenue && <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelectedVenue(null)}><section className="booking-panel" role="dialog" aria-modal="true" aria-labelledby="booking-title" onMouseDown={(event) => event.stopPropagation()}><button className="close" onClick={() => setSelectedVenue(null)} aria-label="Close booking panel">×</button><p className="eyebrow">{selectedVenue.location}</p><h2 id="booking-title">{selectedVenue.name}</h2><p className="booking-intro">Choose one facility, then send a quick booking request.</p><div className="facility-list">{selectedVenue.facilities.map((facility) => <button type="button" className={selectedFacility === facility ? "selected" : ""} aria-pressed={selectedFacility === facility} onClick={() => setSelectedFacility(facility)} key={facility}>{selectedFacility === facility ? "✓ " : "+ "}{facility}</button>)}</div>{selectedFacility && <p className="selected-facility">Selected: <b>{selectedFacility}</b></p>}<form onSubmit={submitBooking}><label>Your name<input required name="name" placeholder="Your name" /></label><label>Email address<input required type="email" name="email" placeholder="you@example.com" /></label><label>What are you planning?<textarea required name="details" placeholder="e.g. A Saturday dance class for 20 people" rows={3} /></label><button className="primary" type="submit">Send booking request <span>→</span></button></form></section></div>}
      {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss message">×</button></div>}
    </main>
  );
}
