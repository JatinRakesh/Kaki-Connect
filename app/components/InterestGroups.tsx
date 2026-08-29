"use client";

import { useState } from "react";

type InterestGroup = {
id: number;
name: string;
category: string;
description: string;
members: number;
};

export default function InterestGroups() {
const [groups, setGroups] = useState<InterestGroup[]>([]);
const [showForm, setShowForm] = useState(false);
const [joinedGroups, setJoinedGroups] = useState<number[]>([]);
const [groupName, setGroupName] = useState("");
const [category, setCategory] = useState("");
const [description, setDescription] = useState("");

function createGroup() {
if (!groupName || !category || !description) {
return;
}

const newGroup: InterestGroup = {
id: Date.now(),
name: groupName,
category: category,
description: description,
members: 1,
};

setGroups([...groups, newGroup]);

setGroupName("");
setCategory("");
setDescription("");
setShowForm(false);
}

function joinGroup(groupId: number) {
if (joinedGroups.includes(groupId)) {
return;
}

setJoinedGroups([...joinedGroups, groupId]);

setGroups(
groups.map((group) =>
group.id === groupId
? { ...group, members: group.members + 1 }
: group
)
);
}

return (
<section>
<h2>Interest Groups</h2>

{groups.length === 0 && (
<p>No interest groups have been created yet.</p>
)}

{groups.map((group) => (
<div key={group.id}>
<h3>{group.name}</h3>
<p>{group.category}</p>
<p>{group.description}</p>
<p>{group.members} members</p>

<button onClick={() => joinGroup(group.id)}>
{joinedGroups.includes(group.id)
? "Joined"
: "Join group"}
</button>
</div>
))}

<button onClick={() => setShowForm(true)}>
Create interest group
</button>

{showForm && (
<div>
<h3>Create an interest group</h3>

<input
type="text"
placeholder="Group name"
value={groupName}
onChange={(e) => setGroupName(e.target.value)}
/>

<input
type="text"
placeholder="Category"
value={category}
onChange={(e) => setCategory(e.target.value)}
/>

<textarea
placeholder="Description"
value={description}
onChange={(e) => setDescription(e.target.value)}
/>

<button onClick={createGroup}>Create group</button>
</div>
)}
</section>
);
}