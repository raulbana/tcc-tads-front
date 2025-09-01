"use client";
import { useMemo, useState, useCallback } from "react";
import moment, { Moment } from "moment";
import { DayItem, LeakageLevel, CalendarDayData } from "@/app/types/diary";
import {
  buildMonthMatrix,
  formatToFirstLetterUppercase,
  getMonthIsoRange,
} from "../../utils/calendarUtils";
import useDiaryQueries from "../../services/diaryQueryFactory";

export function useCalendar() {
  const [monthRef, setMonthRef] = useState<Moment>(moment());

  const matrix = useMemo(() => buildMonthMatrix(monthRef), [monthRef]);

  const { from, to } = useMemo(() => getMonthIsoRange(monthRef), [monthRef]);

  const diaryQueries = useDiaryQueries(["calendar-range", from, to]);
  const { data, isLoading, refetch } = diaryQueries.getByRange(
    new Date(from),
    new Date(to)
  );

  const daysFlat: DayItem[] = useMemo(() => {
    const backendMap: Record<string, CalendarDayData> = data ?? {};

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
      const level =
        (dayData?.leakageLevel as LeakageLevel | undefined) ?? undefined;

      return {
        dayTitle: formatToFirstLetterUppercase(cell.date.format("ddd")),
        dayNumber: Number(cell.date.format("D")),
        date: cell.date.toDate(),
        isToday: cell.isToday,
        level,
      };
    });
  }, [matrix, data, monthRef]);

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
    isLoading,
    refetch,
    goPrevMonth,
    goNextMonth,
    setMonth,
  };
}