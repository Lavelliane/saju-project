import { z } from "zod";

export const saveSajuReadingSchema = z.object({
  label: z.string().min(1).max(100),
  birthDate: z.string().min(1),
  isLunar: z.boolean().default(false),
  analysis: z.record(z.string(), z.unknown()),
  aiInterpretation: z.string().optional(),
});

export type SaveSajuReadingDto = z.infer<typeof saveSajuReadingSchema>;

export const updateSajuReadingSchema = z.object({
  label: z.string().min(1).max(100).optional(),
  aiInterpretation: z.string().optional(),
});

export type UpdateSajuReadingDto = z.infer<typeof updateSajuReadingSchema>;
