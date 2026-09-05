import { NextResponse } from "next/server";
import { db } from "@/db";
import { events, eventParticipants } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    /*
      TEMPORARY.

      Replace this with the logged-in user's
      actual ID later.
    */
    const userId = 1;

    const result = await db
      .select({
        id: events.id,
        title: events.title,
        description: events.description,
        date: events.date,
        time: events.time,
        location: events.location,
        category: events.category,
        organiser: events.organiser,
        capacity: events.capacity,
        image: events.image,
        joinedAt: eventParticipants.joinedAt,
      })
      .from(eventParticipants)

      .innerJoin(
        events,
        eq(eventParticipants.eventId, events.id)
      )

      .where(eq(eventParticipants.userId, userId));

    return NextResponse.json(result);
  } catch (error) {
    console.error("My events error:", error);

    return NextResponse.json(
      {
        message: "Unable to retrieve your events",
      },
      {
        status: 500,
      }
    );
  }
}