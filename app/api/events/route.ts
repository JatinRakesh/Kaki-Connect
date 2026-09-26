import { NextResponse } from "next/server";
import { getDb } from "../../../db";
import { events } from "../../../db/schema";

export async function POST(request: Request) {
try {
const data = await request.json();

const {
title,
description,
category,
location,
date,
startTime,
endTime,
capacity,
} = data;

if (
!title ||
!description ||
!category ||
!location ||
!date ||
!startTime ||
!endTime ||
!Number.isInteger(Number(capacity)) ||
Number(capacity) < 1 ||
endTime <= startTime
) {
return NextResponse.json(
{ error: "Please enter valid event details." },
{ status: 400 }
);
}

const db = getDb();

const saved = await db
.insert(events)
.values({
title,
description,
category,
location,
date,
startTime,
endTime,
capacity: Number(capacity),
createdAt: new Date().toISOString(),
})
.returning();

return NextResponse.json(
{ message: "Event saved successfully!", event: saved[0] },
{ status: 201 }
);
} catch (error) {
console.error("Failed to save event:", error);

return NextResponse.json(
{ error: "Could not save the event." },
{ status: 500 }
);
}
}
