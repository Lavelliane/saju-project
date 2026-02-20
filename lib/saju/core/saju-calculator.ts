import {
  calculateSaju as mCalculateSaju,
  lunarToSolar as mLunarToSolar,
} from "@fullstackfamily/manseryeok";
import type { SajuInput, SajuResult } from "../types/saju";
import { resolvePillar } from "./pillar-resolver";

/**
 * 사주팔자 산출 메인 함수
 *
 * 1. 음력이면 양력으로 변환
 * 2. manseryeok.calculateSaju() 호출
 * 3. pillarResolver로 자체 타입 변환
 * 4. SajuResult 반환
 */
export function calculateSaju(input: SajuInput): SajuResult {
  let { year, month, day, hour, minute, isLunar, isLeapMonth, longitude } = input;

  if (isLunar) {
    const converted = mLunarToSolar(year, month, day, isLeapMonth);
    year = converted.solar.year;
    month = converted.solar.month;
    day = converted.solar.day;
  }

  const sajuResult = mCalculateSaju(
    year,
    month,
    day,
    hour,
    minute ?? 0,
    longitude != null ? { longitude } : undefined,
  );

  const yearPillar = resolvePillar(sajuResult.yearPillar);
  const monthPillar = resolvePillar(sajuResult.monthPillar);
  const dayPillar = resolvePillar(sajuResult.dayPillar);

  if (!sajuResult.hourPillar) {
    throw new Error("Hour pillar is required. Please provide hour input.");
  }
  const hourPillar = resolvePillar(sajuResult.hourPillar);

  return { yearPillar, monthPillar, dayPillar, hourPillar };
}
