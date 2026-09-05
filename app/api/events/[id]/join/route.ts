import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { events, eventParticipants } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const eventId = Number(id);

    if (Number.isNaN(eventId)) {
      return NextResponse.json(
        {
          message: "Invalid event ID",
        },
        {
          status: 400,
        }
      );
    }

    /*
      TEMPORARY USER

      Later replace this with the ID of the
      currently logged-in resident.
    */

    const userId = 1;

    // Check if event exists
    const eventResult = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    if (eventResult.length === 0) {
      return NextResponse.json(
        {
          message: "Event not found",
        },
        {
          status: 404,
        }
      );
    }

    const event = eventResult[0];

    // Only allow approved events
    if (event.status !== "approved") {
      return NextResponse.json(
        {
          message: "This event is not available",
        },
        {
          status: 403,
        }
      );
    }

    // Check whether resident already joined
    const existingParticipant = await db
      .select()
      .from(eventParticipants)
      .where(
        and(
          eq(eventParticipants.eventId, eventId),
          eq(eventParticipants.userId, userId)
        )
      )
      .limit(1);

    if (existingParticipant.length > 0) {
      return NextResponse.json(
        {
          message: "You have already joined this event",
        },
        {
          status: 409,
        }
      );
    }

    // Count participants
    const countResult = await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(eventParticipants)
      .where(eq(eventParticipants.eventId, eventId));

    const participantCount = Number(countResult[0]?.count ?? 0);

    // Check capacity
    if (participantCount >= event.capacity) {
      return NextResponse.json(
        {
          message: "This event is full",
        },
        {
          status: 409,
        }
      );
    }

    // Join event
    await db.insert(eventParticipants).values({
      eventId,
      userId,
    });

    return NextResponse.json({
      message: "Event joined successfully",
    });
  } catch (error) {
    console.error("Join event error:", error);

    return NextResponse.json(
      {
        message: "Unable to join event",
      },
      {
        status: 500,
      }
    );
  }
}