import { pgTable, uuid, text, timestamp, numeric, serial, integer, jsonb } from "drizzle-orm/pg-core";
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
            targetStep: number;
        }
        flag_type: "UNPROV." | "ABSOL." | "WEAK."
    }>().notNull(),
    flags: jsonb("flags").$type<{
        type: 'UNPROV.' | 'ABSOL.' | 'WEAK.'
        instance: string
        critique: string
    }>(),
    flag_count: integer("flag_count").default(0).notNull(),
    created_at: timestamp("created_at", {withTimezone: true}).defaultNow().notNull()
})