// Intentionally empty by default.
// Add Drizzle tables here when the site actually needs a database.
// See examples/d1/db/schema.ts for an opt-in example.
export {};
import {
  sqliteTable,
  integer,
  text,
} from "drizzle-orm/sqlite-core";

export const events = sqliteTable("events", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  title: text("title").notNull(),

  description: text("description").notNull(),

  date: text("date").notNull(),

  time: text("time").notNull(),

  location: text("location").notNull(),

  category: text("category").notNull(),

  organiser: text("organiser").notNull(),

  capacity: integer("capacity").notNull(),

  image: text("image"),

  status: text("status").notNull().default("approved"),
});


export const eventParticipants = sqliteTable(
  "event_participants",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),

    eventId: integer("event_id")
      .notNull()
      .references(() => events.id),

    userId: integer("user_id").notNull(),

    joinedAt: text("joined_at")
      .notNull()
      .$defaultFn(() => new Date().toISOString()),
  }
);