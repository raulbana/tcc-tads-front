export type LeakageLevel = 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH'
export type UrinationAmount = 'LOW' | 'MEDIUM' | 'HIGH'
export interface UrinationData {
  observation: string;
  time: string;
  amount: UrinationAmount;
  leakage: boolean;
  reason?: string;
  urgency?: boolean;
}

export type CalendarDayData = {
  date: Date;
  leakageLevel?: LeakageLevel;
  eventsCount?: number;
  completedExercises?: number;
  notesPreview?: string;
  urinationData?: UrinationData[];
  dayTitle: string;
  dayNumber: number;
  isToday?: boolean;
  level?: LeakageLevel;
};

export type CalendarRangeResponse = Record<string, CalendarDayData>;
