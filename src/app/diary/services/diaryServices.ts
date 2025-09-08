import { CalendarRangeResponse } from "@/app/types/diary";

export const diaryServices = {
  async getCalendarRange(fromDate: Date, toDate: Date): Promise<CalendarRangeResponse> {
    const mockData: CalendarRangeResponse = {
      // Dia sem vazamento (NONE) - tile verde
      '2025-09-01': {
        date: new Date('2025-09-01'),
        dayTitle: 'Seg',
        dayNumber: 1,
        leakageLevel: 'NONE',
        level: 'NONE',
        eventsCount: 3,
        completedExercises: 3,
        notesPreview: 'Excelente dia! Sem episódios',
        urinationData: [
          {
            observation: 'Normal, sem urgência',
            time: '07:30',
            amount: 'MEDIUM',
            leakage: false,
          },
          {
            observation: 'Micção normal',
            time: '11:00',
            amount: 'HIGH',
            leakage: false,
          },
          {
            observation: 'Antes de dormir',
            time: '22:00',
            amount: 'LOW',
            leakage: false,
          },
        ],
        isToday: false,
      },

      // Dia com vazamento baixo (LOW) - tile azul
      '2025-09-02': {
        date: new Date('2025-09-02'),
        dayTitle: 'Ter',
        dayNumber: 2,
        leakageLevel: 'LOW',
        level: 'LOW',
        eventsCount: 2,
        completedExercises: 1,
        notesPreview: 'Pequenos episódios pela manhã',
        urinationData: [
          {
            observation: 'Leve perda ao tossir',
            time: '08:15',
            amount: 'LOW',
            leakage: true,
            reason: 'Tosse',
          },
          {
            observation: 'Normal',
            time: '14:30',
            amount: 'MEDIUM',
            leakage: false,
          },
        ],
        isToday: false,
      },

      // Dia com vazamento médio (MEDIUM) - tile amarelo
      '2025-09-03': {
        date: new Date('2025-09-03'),
        dayTitle: 'Qua',
        dayNumber: 3,
        leakageLevel: 'MEDIUM',
        level: 'MEDIUM',
        eventsCount: 5,
        completedExercises: 2,
        notesPreview: 'Vários episódios de urgência',
        urinationData: [
          {
            observation: 'Urgência forte',
            time: '06:45',
            amount: 'HIGH',
            leakage: true,
            urgency: true,
            reason: 'Dormiu mal',
          },
          {
            observation: 'Perda ao levantar peso',
            time: '10:20',
            amount: 'MEDIUM',
            leakage: true,
            reason: 'Esforço físico',
          },
          {
            observation: 'Normal',
            time: '16:00',
            amount: 'MEDIUM',
            leakage: false,
          },
        ],
        isToday: false,
      },

      // Dia com vazamento alto (HIGH) - tile vermelho
      '2025-09-04': {
        date: new Date('2025-09-04'),
        dayTitle: 'Qui',
        dayNumber: 4,
        leakageLevel: 'HIGH',
        level: 'HIGH',
        eventsCount: 4,
        completedExercises: 0,
        notesPreview: 'Dia muito difícil, múltiplos episódios',
        urinationData: [
          {
            observation: 'Perda significativa pela manhã',
            time: '07:00',
            amount: 'HIGH',
            leakage: true,
            urgency: true,
            reason: 'Infecção urinária',
          },
          {
            observation: 'Urgência extrema',
            time: '09:30',
            amount: 'MEDIUM',
            leakage: true,
            urgency: true,
          },
          {
            observation: 'Não conseguiu chegar ao banheiro',
            time: '13:15',
            amount: 'HIGH',
            leakage: true,
            urgency: true,
          },
          {
            observation: 'Perda ao espirrar',
            time: '17:45',
            amount: 'LOW',
            leakage: true,
            reason: 'Espirro',
          },
        ],
        isToday: false,
      },

      // Dia sem dados (sem level) - tile cinza
      '2025-09-05': {
        date: new Date('2025-09-05'),
        dayTitle: 'Sex',
        dayNumber: 5,
        eventsCount: 0,
        completedExercises: 0,
        notesPreview: '',
        urinationData: [],
        isToday: false,
      },

      '2025-09-06': {
        date: new Date('2025-09-06'),
        dayTitle: 'Sab',
        dayNumber: 6,
        leakageLevel: 'NONE',
        level: 'NONE',
        eventsCount: 0,
        completedExercises: 0,
        notesPreview: 'Foco nos exercícios',
        urinationData: [],
        isToday: false,
      },

      '2025-09-08': {
        date: new Date('2025-09-08'),
        dayTitle: 'Seg',
        dayNumber: 8,
        leakageLevel: 'NONE',
        level: 'NONE',
        eventsCount: 0,
        completedExercises: 0,
        notesPreview: 'Foco nos exercícios',
        urinationData: [],
        isToday: false,
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