import { NextResponse } from "next/server";
import { db } from "@/db";
import { eventParticipants } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function DELETE(
  request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const eventId = Number(id);

    /*
      TEMPORARY USER ID.
      Replace this with logged-in user's ID later.
    */
    const userId = 1;

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

    if (existingParticipant.length === 0) {
      return NextResponse.json(
        {
          message: "You have not joined this event",
        },
        {
          status: 404,
        }
      );
    }

    await db
      .delete(eventParticipants)
      .where(
        and(
          eq(eventParticipants.eventId, eventId),
          eq(eventParticipants.userId, userId)
        )
      );

    return NextResponse.json({
      message: "You have left the event",
    });
  } catch (error) {
    console.error("Leave event error:", error);

    return NextResponse.json(
      {
        message: "Unable to leave event",
      },
      {
        status: 500,
      }
    );
  }
}