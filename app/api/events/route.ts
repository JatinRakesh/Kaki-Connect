import { NextResponse } from "next/server";
import { db } from "@/db";
import { events, eventParticipants } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function GET() {
  try {
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

        participants: sql<number>`
          COUNT(${eventParticipants.id})
        `,
      })
      .from(events)

      .leftJoin(
        eventParticipants,
        eq(events.id, eventParticipants.eventId)
      )

      .where(eq(events.status, "approved"))

      .groupBy(events.id);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error getting events:", error);

    return NextResponse.json(
      {
        message: "Unable to get events",
      },
      {
        status: 500,
      }
    );
  }
}