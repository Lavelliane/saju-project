import {
  lunarToSolar as mLunarToSolar,
  solarToLunar as mSolarToLunar,
} from "@fullstackfamily/manseryeok";
import type { CalendarConversionResult } from "../types/calendar";

export function solarToLunar(year: number, month: number, day: number): CalendarConversionResult {
  const result = mSolarToLunar(year, month, day);
  return {
    solar: { year: result.solar.year, month: result.solar.month, day: result.solar.day },
    lunar: {
      year: result.lunar.year,
      month: result.lunar.month,
      day: result.lunar.day,
      isLeapMonth: result.lunar.isLeapMonth,
    },
  };
}

export function lunarToSolar(
  year: number,
  month: number,
  day: number,
  isLeapMonth = false,
): CalendarConversionResult {
  const result = mLunarToSolar(year, month, day, isLeapMonth);
  return {
    solar: { year: result.solar.year, month: result.solar.month, day: result.solar.day },
    lunar: {
      year: result.lunar.year,
      month: result.lunar.month,
      day: result.lunar.day,
      isLeapMonth: result.lunar.isLeapMonth,
    },
  };
}
