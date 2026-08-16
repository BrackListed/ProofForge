import { pgTable, uuid, text, timestamp, numeric, serial, integer, jsonb, unique } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: text("clerk_user_id").notNull().unique(),
    email: text("email").default("").unique(),
    username: text("username").notNull(),
    createdAt: timestamp("created_at",{withTimezone:true}).defaultNow().notNull()
})

export const scrutinize = pgTable("scrutinize", {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: uuid("user_id").references(() => users.id, {onDelete: "cascade"}),
    content: text('content').notNull(),
    document_name: text("document_name"),
    page_number: text("page_number"),
    premise: text("premise").notNull(),
    logic: jsonb("logic").$type<{
        step: number
        claim: string
        relation: {
            type: 'CAUSE' | 'EVIDENCE' | 'INFERENCE' | 'CONTRADICTION' | 'SUB-CLAIM';
            targetStep: number | null;
        }
        flagType: "UNPROV." | "ABSOL." | "WEAK." | null
    }[]>().notNull(),
    flags: jsonb("flags").$type<{
        type: 'UNPROV.' | 'ABSOL.' | 'WEAK.'
        instance: string
        critique: string
    }[]>(),
    flag_count: integer("flag_count").default(0).notNull(),
    created_at: timestamp("created_at", {withTimezone: true}).defaultNow().notNull()
})

export const debate_room = pgTable("debate_room", {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: uuid("user_id").references(() => users.id, {onDelete: "cascade"}),
    title: text('title').notNull().default("No title"),
    topic: text("topic").notNull(),
})

export const debate_logs = pgTable("debate_logs", {
    id: uuid("id").defaultRandom().primaryKey(),
    user_id: uuid("user_id").references(() => users.id, {onDelete: "cascade"}),
    room_id: uuid("room_id").references(() => debate_room.id, {onDelete: "cascade"}),
    transcript: jsonb("transcript").$type<
    Array<{
      sender: "user" | "ai";
      text: string;
    }>
    >().default([]).notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull()
}, (table) => [
    unique("user_room_unique").on(table.user_id, table.room_id)
])

export const debateRoomRelations = relations(debate_room, ({ many }) => ({
    logs: many(debate_logs)
}))

export const debateLogsRelations = relations(debate_logs, ({ one }) => ({
    room: one(debate_room, {
        fields: [debate_logs.room_id],
        references: [debate_room.id]
    })
}))

export const usersRelations = relations(users, ({ many }) => ({
    scrutinizeLogs: many(scrutinize)
}))

export const scrutinizeRelations = relations(scrutinize, ({ one }) => ({
    user: one(users, {
        fields: [scrutinize.user_id],
        references: [users.id]
    })
}))