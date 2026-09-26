import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const events = sqliteTable("events", {
id: integer("id").primaryKey({ autoIncrement: true }),
title: text("title").notNull(),
description: text("description").notNull(),
category: text("category").notNull(),
location: text("location").notNull(),
date: text("date").notNull(),
startTime: text("start_time").notNull(),
endTime: text("end_time").notNull(),
capacity: integer("capacity").notNull(),
createdAt: text("created_at").notNull(),
});
