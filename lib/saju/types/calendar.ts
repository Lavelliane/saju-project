export interface SolarDate {
  year: number;
  month: number;
  day: number;
}

export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeapMonth: boolean;
}

export interface CalendarConversionResult {
  solar: SolarDate;
  lunar: LunarDate;
}
