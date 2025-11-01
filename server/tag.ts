"use server";

import { db } from "@/db/drizzle";
import { Tag, tags } from "@/db/schema";
import { eq, asc } from "drizzle-orm";

export async function getTags() {
  try {
    const allTags = await db.select().from(tags).orderBy(asc(tags.createdAt));
    return allTags;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function createTag(tag: Omit<Tag, "id" | "createdAt">) {
  try {
    await db.insert(tags).values(tag);
  } catch (error) {
    console.error(error);
    return { error: "Failed to create tag" };
  }
}

export async function updateTag(tag: Omit<Tag, "createdAt">) {
  try {
    await db
      .update(tags)
      .set({ name: tag.name })
      .where(eq(tags.id, tag.id));
  } catch (error) {
    console.error(error);
    return { error: "Failed to update tag" };
  }
}

export async function deleteTag(id: string) {
  try {
    await db.delete(tags).where(eq(tags.id, id));
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete tag" };
  }
}