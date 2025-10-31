"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { CalendarDayData, UrinationData } from "@/app/types/diary";
import moment from "moment";
import { useCalendar } from "../Calendar/useCalendar";
import { DayDataFormValues } from "../DayDataForm/useDayDataForm";

export const useDiaryPage = () => {
  const { daysFlat } = useCalendar();
  const [selectedDay, setSelectedDay] = useState<CalendarDayData | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<{
    record: UrinationData;
    index: number;
  } | null>(null);

  const todayOrFirstDay = useMemo(() => {
    if (!daysFlat || daysFlat.length === 0) return null;

    const today = daysFlat.find((day) => day.isToday);
    if (today) return today;

    const currentMonth = moment().month();
    const currentYear = moment().year();

    const currentMonthDay = daysFlat.find(
      (day) =>
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

  const handleAddRecord = useCallback(() => {
    setIsAddModalOpen(true);
  }, []);

  const handleEditRecord = useCallback(
    (record: UrinationData, index: number) => {
      setEditingRecord({ record, index });
      setIsEditModalOpen(true);
    },
    []
  );

  const handleCloseAddModal = useCallback(() => {
    setIsAddModalOpen(false);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditingRecord(null);
  }, []);

  const handleSubmitNewRecord = useCallback(
    (data: DayDataFormValues) => {
      console.log("Novo registro:", data, "para data:", selectedDay?.date);
      // TODO: Implementar a lógica de criação do registro
      setIsAddModalOpen(false);
    },
    [selectedDay]
  );

  const handleSubmitEditRecord = useCallback(
    (data: DayDataFormValues) => {
      console.log("Editando registro:", data, "índice:", editingRecord?.index);
      // TODO: Implementar a lógica de edição do registro
      setIsEditModalOpen(false);
      setEditingRecord(null);
    },
    [editingRecord]
  );

  return {
    selectedDay,
    handleDaySelect,
    handleAddRecord,
    handleEditRecord,
    isAddModalOpen,
    isEditModalOpen,
    editingRecord,
    handleCloseAddModal,
    handleCloseEditModal,
    handleSubmitNewRecord,
    handleSubmitEditRecord,
  };
};
