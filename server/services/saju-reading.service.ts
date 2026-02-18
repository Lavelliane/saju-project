import { eq, and, desc } from "drizzle-orm";
import { db } from "@/db";
import { sajuReading } from "@/db/schema/saju";
import type { SaveSajuReadingDto, UpdateSajuReadingDto } from "@/server/validators/saju-reading.validators";

function generateId(): string {
  return `saju_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export const sajuReadingService = {
  async getAll(userId: string) {
    return db
      .select()
      .from(sajuReading)
      .where(eq(sajuReading.userId, userId))
      .orderBy(desc(sajuReading.createdAt));
  },

  async getById(userId: string, id: string) {
    const rows = await db
      .select()
      .from(sajuReading)
      .where(and(eq(sajuReading.id, id), eq(sajuReading.userId, userId)))
      .limit(1);
    return rows[0] ?? null;
  },

  async create(userId: string, data: SaveSajuReadingDto) {
    const rows = await db
      .insert(sajuReading)
      .values({
        id: generateId(),
        userId,
        label: data.label,
        birthDate: data.birthDate,
        isLunar: String(data.isLunar ?? false),
        analysis: data.analysis,
        aiInterpretation: data.aiInterpretation ?? null,
      })
      .returning();
    return rows[0]!;
  },

  async update(userId: string, id: string, data: UpdateSajuReadingDto) {
    const rows = await db
      .update(sajuReading)
      .set({
        ...(data.label !== undefined && { label: data.label }),
        ...(data.aiInterpretation !== undefined && { aiInterpretation: data.aiInterpretation }),
        updatedAt: new Date(),
      })
      .where(and(eq(sajuReading.id, id), eq(sajuReading.userId, userId)))
      .returning();
    return rows[0] ?? null;
  },

  async delete(userId: string, id: string) {
    const rows = await db
      .delete(sajuReading)
      .where(and(eq(sajuReading.id, id), eq(sajuReading.userId, userId)))
      .returning();
    return rows[0] ?? null;
  },

  async getStats(userId: string) {
    const readings = await db
      .select()
      .from(sajuReading)
      .where(eq(sajuReading.userId, userId))
      .orderBy(desc(sajuReading.createdAt));

    const total = readings.length;
    const withAi = readings.filter((r) => r.aiInterpretation).length;
    const latest = readings[0] ?? null;

    return { total, withAi, latest };
  },
};
