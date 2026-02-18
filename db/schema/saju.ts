import { index, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const sajuReading = pgTable(
  "saju_reading",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    label: text("label").notNull(),
    birthDate: text("birth_date").notNull(),
    isLunar: text("is_lunar").notNull().default("false"),
    analysis: jsonb("analysis").notNull(),
    aiInterpretation: text("ai_interpretation"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("saju_reading_user_id_idx").on(table.userId)],
);
