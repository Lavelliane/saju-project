import { z } from "zod";

export const sajuInputSchema = z.object({
  year: z.number().int().min(1900).max(2050),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59).optional(),
  isLunar: z.boolean().optional(),
  isLeapMonth: z.boolean().optional(),
  longitude: z.number().optional(),
});

export type SajuInputDto = z.infer<typeof sajuInputSchema>;

export const solarToLunarSchema = z.object({
  year: z.number().int().min(1900).max(2050),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
});

export type SolarToLunarDto = z.infer<typeof solarToLunarSchema>;

export const lunarToSolarSchema = z.object({
  year: z.number().int().min(1900).max(2050),
  month: z.number().int().min(1).max(12),
  day: z.number().int().min(1).max(31),
  isLeapMonth: z.boolean().optional(),
});

export type LunarToSolarDto = z.infer<typeof lunarToSolarSchema>;
