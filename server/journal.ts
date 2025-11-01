"use server";
export const revalidate = 0;

import { db } from "@/db/drizzle";
import { Journal, journalEntries, journalEntryTags } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { v4 as uuid } from "uuid";

export async function getJournals() {
  try {
    const result = await db.query.journalEntries.findMany({
      with: {
        journalEntryTags: {
          columns: { tagId: true },
        },
      },
      orderBy: (entries, { asc }) => [asc(entries.createdAt)],
    });

    return result.map(journal => ({
      ...journal,
      tags: journal.journalEntryTags.map(t => t.tagId),
    }));
  } catch (error) {
    console.error(error);
    throw error;
  }
}


export async function createJournal(journal: Omit<Journal, "id" | "createdAt" | "updatedAt"> & { tags?: string[] }) {
  try {
    const newId = uuid();
    await db.insert(journalEntries).values({ ...journal, id: newId });
    if (journal.tags && journal.tags.length > 0) {
      const tagRelations = journal.tags.map(tagId => ({
        entryId: newId,
        tagId,
      }));
      await db.insert(journalEntryTags).values(tagRelations);
    }
    return { success: true, id: newId };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create journal entry" };
  }
}

export async function updateJournal(
  journal: Omit<Journal, "createdAt" | "updatedAt"> & { tags?: string[] }
) {
  try {
    await db
      .update(journalEntries)
      .set({
        title: journal.title,
        entry: journal.entry,
        mood: journal.mood,
        updatedAt: new Date(),
      })
      .where(eq(journalEntries.id, journal.id));
    await db.delete(journalEntryTags).where(eq(journalEntryTags.entryId, journal.id));

    if (journal.tags && journal.tags.length > 0) {
      const tagRelations = journal.tags.map((tagId) => ({
        entryId: journal.id,
        tagId,
      }));
      await db.insert(journalEntryTags).values(tagRelations);
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update journal entry" };
  }
}

export async function deleteJournal(id: string) {
    try {
        await db.delete(journalEntries).where(eq(journalEntries.id, id));
    } catch (error) {
        console.error(error);
        return { error: "Failed to delete journal entry" };
    }
}