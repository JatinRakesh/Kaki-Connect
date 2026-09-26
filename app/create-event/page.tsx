"use client";

import { useState, type FormEvent } from "react";
import "./create-event.css";

type EventForm = {
title: string;
description: string;
category: string;
location: string;
date: string;
startTime: string;
endTime: string;
capacity: string;
};

const emptyForm: EventForm = {
title: "",
description: "",
category: "",
location: "",
date: "",
startTime: "",
endTime: "",
capacity: "",
};

export default function CreateEventPage() {
const [form, setForm] = useState<EventForm>(emptyForm);
const [message, setMessage] = useState("");
const [saving, setSaving] = useState(false);
const [saved, setSaved] = useState(false);

function updateField(field: keyof EventForm, value: string) {
setForm((previous) => ({
...previous,
[field]: value,
}));
}

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
event.preventDefault();
setMessage("");

if (form.endTime <= form.startTime) {
setMessage("The end time must be later than the start time.");
return;
}

setSaving(true);

try {
const response = await fetch("/api/events", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify(form),
});

const result = await response.json();

if (!response.ok) {
setMessage(result.error || "Could not save the event.");
return;
}

setSaved(true);
setMessage("Your event has been saved successfully!");
setForm(emptyForm);
} catch {
setMessage(
"Something went wrong. Please try again."
);
} finally {
setSaving(false);
}
}

return (
<main className="create-event-page">
<div className="create-event-container">
<a className="create-event-back" href="/">
← Back to Kaki Connect
</a>

<p className="eyebrow">
BRING YOUR NEIGHBOURHOOD TOGETHER
</p>

<h1>Create an event.</h1>

<p className="create-event-intro">
Have an idea for your community? Share the details
and invite your neighbours to join you.
</p>

<form
className="create-event-form"
onSubmit={handleSubmit}
>
<section className="create-event-section">
<h2>01. About your event</h2>
<p>Tell everyone what you are planning.</p>

<label htmlFor="event-title">
Event name *
</label>
<input
id="event-title"
type="text"
placeholder="e.g. Weekend Badminton"
maxLength={100}
required
disabled={saving}
value={form.title}
onChange={(event) =>
updateField("title", event.target.value)
}
/>

<label htmlFor="event-description">
Description *
</label>
<textarea
id="event-description"
placeholder="What will participants be doing?"
rows={5}
maxLength={2000}
required
disabled={saving}
value={form.description}
onChange={(event) =>
updateField("description", event.target.value)
}
/>

<label htmlFor="event-category">
Category *
</label>
<select
id="event-category"
required
disabled={saving}
value={form.category}
onChange={(event) =>
updateField("category", event.target.value)
}
>
<option value="">Select a category</option>
<option value="Sports">Sports</option>
<option value="Arts & Crafts">
Arts & Crafts
</option>
<option value="Food">Food</option>
<option value="Education">Education</option>
<option value="Community">Community</option>
<option value="Others">Others</option>
</select>
</section>

<section className="create-event-section">
<h2>02. When and where</h2>
<p>Help your neighbours find your event.</p>

<label htmlFor="event-location">
Location *
</label>
<input
id="event-location"
type="text"
placeholder="e.g. Yishun Community Club"
maxLength={200}
required
disabled={saving}
value={form.location}
onChange={(event) =>
updateField("location", event.target.value)
}
/>

<label htmlFor="event-date">
Date *
</label>
<input
id="event-date"
type="date"
min={new Date().toLocaleDateString("en-CA")}
required
disabled={saving}
value={form.date}
onChange={(event) =>
updateField("date", event.target.value)
}
/>

<div className="create-event-two-columns">
<div>
<label htmlFor="event-start">
Start time *
</label>
<input
id="event-start"
type="time"
required
disabled={saving}
value={form.startTime}
onChange={(event) =>
updateField("startTime", event.target.value)
}
/>
</div>

<div>
<label htmlFor="event-end">
End time *
</label>
<input
id="event-end"
type="time"
required
disabled={saving}
value={form.endTime}
onChange={(event) =>
updateField("endTime", event.target.value)
}
/>
</div>
</div>
</section>

<section className="create-event-section">
<h2>03. Participants</h2>
<p>How many people can join?</p>

<label htmlFor="event-capacity">
Maximum participants *
</label>
<input
id="event-capacity"
type="number"
min="1"
max="10000"
step="1"
placeholder="e.g. 20"
required
disabled={saving}
value={form.capacity}
onChange={(event) =>
updateField("capacity", event.target.value)
}
/>
</section>

{message && (
<p
className="create-event-message"
role="status"
>
{message}
</p>
)}

<div className="create-event-actions">
<a
href="/"
className="create-event-cancel"
>
Cancel
</a>

<button
className="primary"
type="submit"
disabled={saving}
>
{saving
? "Saving..."
: saved
? "Create another event"
: "Create event"}
</button>
</div>
</form>
</div>
</main>
);
}

