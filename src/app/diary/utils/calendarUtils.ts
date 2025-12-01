import moment, { Moment } from 'moment';
import "moment/locale/pt-br";

moment.locale('pt-br');

export interface MonthCell {
  date: Moment;
  inCurrentMonth: boolean;
  isToday: boolean;
}

export function formatToFirstLetterUppercase(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function getMonthIsoRange(baseDate: Date | Moment): { from: string; to: string } {
  const base = moment(baseDate);
  const startOfMonth = base.clone().startOf('month');
  const endOfMonth = base.clone().endOf('month');

  const calendarStart = startOfMonth.clone().startOf('week');
  const calendarEnd = endOfMonth.clone().endOf('week');

  return {
    from: calendarStart.format('YYYY-MM-DD'),
    to: calendarEnd.format('YYYY-MM-DD'),
  };
}

export function buildMonthMatrix(baseDate: Date | Moment): MonthCell[][] {
  const base = moment(baseDate);
  const startOfMonth = base.clone().startOf('month');
  const endOfMonth = base.clone().endOf('month');

  const calendarStart = startOfMonth.clone().startOf('week');
  const calendarEnd = endOfMonth.clone().endOf('week');

  const weeks: MonthCell[][] = [];

  const current = calendarStart.clone();

  while (current.isSameOrBefore(calendarEnd)) {
    const week: MonthCell[] = [];
    for (let i = 0; i < 7; i++) {
      week.push({
        date: current.clone(),
        inCurrentMonth: current.month() === base.month(),
        isToday: current.isSame(moment(), 'day'),
      });
      current.add(1, 'day');
    }
    weeks.push(week);
  }

  return weeks;
}