import { CalendarRangeResponse } from "@/app/types/diary";

export const diaryServices = {
  async getCalendarRange(fromDate: Date, toDate: Date): Promise<CalendarRangeResponse> {
    const mockData: CalendarRangeResponse = {
      '2024-01-15': {
        date: '2024-01-15',
        leakageLevel: 'LOW',
        eventsCount: 2,
        completedExercises: 1,
        notesPreview: 'Dia tranquilo',
      },
      '2024-01-16': {
        date: '2024-01-16',
        leakageLevel: 'MEDIUM',
        eventsCount: 3,
        completedExercises: 0,
        notesPreview: 'Alguns episódios',
      },
      '2024-01-17': {
        date: '2024-01-17',
        leakageLevel: 'HIGH',
        eventsCount: 5,
        completedExercises: 2,
        notesPreview: 'Dia mais difícil',
      },
    };

    return new Promise((resolve) => {
      setTimeout(() => resolve(mockData), 500);
    });
  },

  async generateMonthlyReport(year: number, month: number): Promise<Blob> {
    return new Promise((resolve) => {
      const mockPdfContent = new Blob(['Mock PDF content'], { type: 'application/pdf' });
      setTimeout(() => resolve(mockPdfContent), 1000);
    });
  },
};