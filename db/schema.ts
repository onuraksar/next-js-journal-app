import { relations } from "drizzle-orm";
import { text, pgTable, uuid, timestamp, pgEnum, boolean, primaryKey } from "drizzle-orm/pg-core";

export const moodEnum = pgEnum("mood", ["happy", "sad", "neutral", "anxious", "excited"]);

export const journalEntries = pgTable("journal", {
  id: uuid("id").primaryKey().defaultRandom(),
  // todo: enable after authentication configs done:
  // userId: uuid("user_id").notNull(),
  title: text("title"), 
  entry: text("entry").notNull(),
  mood: moodEnum("mood").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
});

export const tags = pgTable("tags", {
  id: uuid("id").primaryKey().defaultRandom(),
  // todo: enable after authentication configs done:
  // userId: uuid("user_id")
  //   .notNull()
  //   .references(() => users.id, { onDelete: "cascade" }), 
  name: text("name").notNull(), // Etiketin adı (ör: "travel", "gratitude")
  createdAt: timestamp("created_at").defaultNow(),
});

export const journalEntryTags = pgTable(
  "journal_entry_tags",
  {
    entryId: uuid("entry_id")
      .notNull()
      .references(() => journalEntries.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.entryId, t.tagId] }), 
  })
);

export type Journal = typeof journalEntries.$inferSelect;

export type Tag = typeof tags.$inferSelect;


export interface JournalWithTags extends Journal {
  tags: string[];
}

export const journalEntriesRelations = relations(journalEntries, ({ many }) => ({
  journalEntryTags: many(journalEntryTags),
}));

export const journalEntryTagsRelations = relations(journalEntryTags, ({ one }) => ({
  journalEntry: one(journalEntries, {
    fields: [journalEntryTags.entryId],
    references: [journalEntries.id],
  }),
  tag: one(tags, {
    fields: [journalEntryTags.tagId],
    references: [tags.id],
  }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  journalEntryTags: many(journalEntryTags),
}));