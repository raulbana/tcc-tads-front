"use client";
import { useMemo, useState, useCallback, useEffect } from "react";
import moment, { Moment } from "moment";
import { CalendarDayData } from "@/app/types/diary";
import {
  buildMonthMatrix,
  formatToFirstLetterUppercase,
  getMonthIsoRange,
} from "../../utils/calendarUtils";
import { useDiary } from "@/app/contexts/DiaryContext";

const COLUMNS = 6;

export function useCalendar() {
  const [monthRef, setMonthRef] = useState<Moment>(moment());

  const matrix = useMemo(() => buildMonthMatrix(monthRef), [monthRef]);

  const { from, to } = useMemo(() => getMonthIsoRange(monthRef), [monthRef]);

  const { calendarData, isLoading, loadCalendarEvents } = useDiary();

  useEffect(() => {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    void loadCalendarEvents(fromDate, toDate);
  }, [from, to, loadCalendarEvents]);

  const daysFlat: CalendarDayData[] = useMemo(() => {
    const backendMap: Record<string, CalendarDayData> = calendarData ?? {};

    const selectedMonth = monthRef.month();
    const selectedYear = monthRef.year();

    const monthDays = matrix
      .flat()
      .filter(
        (cell) =>
          cell.date.month() === selectedMonth &&
          cell.date.year() === selectedYear
      );

    return monthDays.map((cell) => {
      const key = cell.date.format("YYYY-MM-DD");
      const dayData = backendMap[key];

      return {
        date: cell.date.toDate(),
        dayTitle: formatToFirstLetterUppercase(cell.date.format("ddd")),
        dayNumber: Number(cell.date.format("D")),
        isToday: cell.isToday,
        level: dayData?.leakageLevel,
        leakageLevel: dayData?.leakageLevel,
        eventsCount: dayData?.eventsCount,
        completedExercises: dayData?.completedExercises,
        notesPreview: dayData?.notesPreview,
        urinationData: dayData?.urinationData,
      };
    });
  }, [matrix, calendarData, monthRef]);

  const formatCalendarRows = (daysFlat: CalendarDayData[]) => {
    const rows: CalendarDayData[][] = [];
    for (let i = 0; i < daysFlat.length; i += COLUMNS) {
      rows.push(daysFlat.slice(i, i + COLUMNS));
    }
    return rows;
  };

  const rows = useMemo(() => {
    return formatCalendarRows(daysFlat);
  }, [daysFlat]);

  const goPrevMonth = useCallback(
    () => setMonthRef((m) => m.clone().subtract(1, "month")),
    []
  );

  const goNextMonth = useCallback(
    () => setMonthRef((m) => m.clone().add(1, "month")),
    []
  );

  const setMonth = useCallback((year: number, monthIndex0Based: number) => {
    setMonthRef(moment({ year, month: monthIndex0Based, date: 1 }));
  }, []);

  return {
    monthRef,
    monthLabel: formatToFirstLetterUppercase(monthRef.format("MMMM [de] YYYY")),
    matrix,
    daysFlat,
    rows,
    isLoading,
    goPrevMonth,
    goNextMonth,
    setMonth,
    formatCalendarRows,
  };
}