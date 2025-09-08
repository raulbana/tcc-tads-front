"use client";
import { useState, useEffect, useMemo } from "react";
import { CalendarDayData } from "@/app/types/diary";
import moment from "moment";
import { useCalendar } from "../Calendar/useCalendar";

export const useDiaryPage = () => {
  const { daysFlat } = useCalendar();
  const [selectedDay, setSelectedDay] = useState<CalendarDayData | null>(null);


  const todayOrFirstDay = useMemo(() => {
    if (!daysFlat || daysFlat.length === 0) return null;

    const today = daysFlat.find(day => day.isToday);
    if (today) return today;

    const currentMonth = moment().month();
    const currentYear = moment().year();

    const currentMonthDay = daysFlat.find(day =>
      moment(day.date).month() === currentMonth &&
      moment(day.date).year() === currentYear
    );

    return currentMonthDay || daysFlat[0];
  }, [daysFlat]);

  useEffect(() => {
    if (todayOrFirstDay && !selectedDay) {
      setSelectedDay(todayOrFirstDay);
    }
  }, [todayOrFirstDay, selectedDay]);

  const handleDaySelect = (day: CalendarDayData) => {
    setSelectedDay(day);
  };

  const handleAddRecord = () => {
    // TODO: e adicionar registro
    console.log("Adicionar registro para:", selectedDay?.date);
  };

  return {
    selectedDay,
    handleDaySelect,
    handleAddRecord,
  };
};