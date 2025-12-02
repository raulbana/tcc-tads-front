export type LeakageLevel = "NONE" | "LOW" | "MEDIUM" | "HIGH";
export type UrinationAmount = "LOW" | "MEDIUM" | "HIGH";

export interface UrinationDataDTO {
  time: string;
  amount: string;
  leakage: boolean;
  reason?: string;
  urgency?: boolean;
  observation?: string;
}

export interface CalendarDayDTO {
  date: string;
  leakageLevel: string;
  eventsCount: number;
  completedExercises: number;
  notesPreview?: string;
  urinationData: UrinationDataDTO[];
  dayTitle: string;
  dayNumber: number;
  isToday: boolean;
  today?: boolean;
}

export interface CalendarRequestDTO {
  date: string;
  leakageLevel: string;
  notesPreview?: string;
  urinationData?: UrinationDataDTO[];
}

export type CalendarRangeResponseDTO = Record<string, CalendarDayDTO>;

export interface ReportUserDTO {
  name: string;
  age: number;
  gender: string;
}

export interface ReportDTO {
  user: ReportUserDTO;
  history: CalendarDayDTO[];
  generatedAt: string;
}

export interface UrinationData {
  observation?: string;
  time: string;
  amount: string;
  leakage: boolean;
  reason?: string;
  urgency?: boolean;
}

export interface CalendarDayData {
  date: Date;
  leakageLevel?: LeakageLevel;
  eventsCount?: number;
  completedExercises?: number;
  notesPreview?: string;
  urinationData: UrinationDataDTO[];
  dayTitle: string;
  dayNumber: number;
  isToday?: boolean;
  level?: LeakageLevel;
}

export type CalendarRangeResponse = Record<string, CalendarDayData>;

export const normalizeTimeToHHMMSS = (time: string): string => {
  if (/^\d{2}:\d{2}:\d{2}$/.test(time)) return time;
  if (/^\d{2}:\d{2}$/.test(time)) return `${time}:00`;
  return time;
};

export const formatTimeToShort = (time: string): string => {
  if (!time) return time;
  const match = /^(\d{2}):(\d{2})(?::(\d{2}))?$/.exec(time);
  if (match) {
    const [, hours, minutes] = match;
    return `${hours}:${minutes}`;
  }
  return time;
};

export const mapUrinationDTOToData = (
  dto: UrinationDataDTO
): UrinationData => ({
  time: formatTimeToShort(dto.time),
  amount: (dto.amount?.toUpperCase() as UrinationAmount) ?? "LOW",
  leakage: dto.leakage,
  reason: dto.reason,
  urgency: dto.urgency,
  observation: dto.observation,
});

export const mapUrinationDataToDTO = (
  data: UrinationData
): UrinationDataDTO => ({
  time: normalizeTimeToHHMMSS(data.time),
  amount: data.amount,
  leakage: data.leakage,
  reason: data.reason,
  urgency: data.urgency,
  observation: data.observation,
});

const ensureLocalDate = (value: string | Date): Date => {
  if (value instanceof Date) return value;
  const withTime = `${value}T00:00:00`;
  const date = new Date(withTime);
  return Number.isNaN(date.getTime()) ? new Date(value) : date;
};

const formatDateToISO = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const mapCalendarDayDTOToData = (
  dto: CalendarDayDTO
): CalendarDayData => ({
  date: ensureLocalDate(dto.date),
  leakageLevel: dto.leakageLevel as LeakageLevel,
  level: dto.leakageLevel as LeakageLevel,
  eventsCount: dto.eventsCount,
  completedExercises: dto.completedExercises,
  notesPreview: dto.notesPreview,
  urinationData: dto.urinationData?.map(mapUrinationDTOToData) ?? [],
  dayTitle: dto.dayTitle,
  dayNumber: dto.dayNumber,
  isToday: dto.isToday,
});

export const mapCalendarDayDataToDTO = (
  data: CalendarDayData
): CalendarDayDTO => ({
  date: formatDateToISO(data.date),
  leakageLevel: (data.leakageLevel ?? "NONE").toString(),
  eventsCount: data.eventsCount ?? data.urinationData?.length ?? 0,
  completedExercises: data.completedExercises ?? 0,
  notesPreview: data.notesPreview,
  urinationData: data.urinationData?.map(mapUrinationDataToDTO) ?? [],
  dayTitle: data.dayTitle,
  dayNumber: data.dayNumber,
  isToday: !!data.isToday,
  today: !!data.isToday,
});

export const mapCalendarRangeDTOToData = (
  dto: CalendarRangeResponseDTO
): CalendarRangeResponse => {
  const result: CalendarRangeResponse = {};
  Object.entries(dto).forEach(([key, value]) => {
    result[key] = mapCalendarDayDTOToData(value);
  });
  return result;
};

export const mapCalendarRangeDataToDTO = (
  data: CalendarRangeResponse
): CalendarRangeResponseDTO => {
  const result: CalendarRangeResponseDTO = {};
  Object.entries(data).forEach(([key, value]) => {
    result[key] = mapCalendarDayDataToDTO(value);
  });
  return result;
};
