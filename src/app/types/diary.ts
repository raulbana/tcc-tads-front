export type LeakageLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH'

export type CalendarDayData = {
  date: string;
  leakageLevel?: LeakageLevel;
  eventsCount?: number;
  completedExercises?: number;
  notesPreview?: string;
};

export type CalendarRangeResponse = Record<string, CalendarDayData>;

export interface DayItem {
  dayTitle: string;
  dayNumber: number;
  date: Date;
  isToday?: boolean;
  level?: LeakageLevel;
}