"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  CalendarDayData,
  LeakageLevel,
  UrinationData,
} from "@/app/types/diary";
import moment from "moment";
import { useCalendar } from "../Calendar/useCalendar";
import { DayDataFormValues } from "../DayDataForm/useDayDataForm";
import { useDiary } from "@/app/contexts/DiaryContext";

export const useDiaryPage = () => {
  const { daysFlat } = useCalendar();
  const {
    addUrinationData,
    editUrinationData,
    deleteUrinationData,
    updateLeakageLevel,
    updateNotes,
    getDayData,
  } = useDiary();
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

  useEffect(() => {
    if (!selectedDay) {
      return;
    }

    const isoDate = moment(selectedDay.date).format("YYYY-MM-DD");
    const updated = getDayData(isoDate);

    if (updated && updated !== selectedDay) {
      setSelectedDay(updated);
    }
  }, [selectedDay, getDayData]);

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

  const handleDeleteRecord = useCallback(
    async (index: number) => {
      if (!selectedDay) return;
      const isoDate = moment(selectedDay.date).format("YYYY-MM-DD");
      await deleteUrinationData(isoDate, index);
      const updated = getDayData(isoDate);
      if (updated) {
        setSelectedDay(updated);
      }
    },
    [selectedDay, deleteUrinationData, getDayData]
  );

  const handleUpdateLeakage = useCallback(
    async (level: LeakageLevel) => {
      if (!selectedDay) return;
      const isoDate = moment(selectedDay.date).format("YYYY-MM-DD");
      await updateLeakageLevel(isoDate, level);
      const updated = getDayData(isoDate);
      if (updated) {
        setSelectedDay(updated);
      }
    },
    [selectedDay, updateLeakageLevel, getDayData]
  );

  const handleUpdateNotes = useCallback(
    async (notes: string) => {
      if (!selectedDay) return;
      const isoDate = moment(selectedDay.date).format("YYYY-MM-DD");
      await updateNotes(isoDate, notes);
      const updated = getDayData(isoDate);
      if (updated) {
        setSelectedDay(updated);
      }
    },
    [selectedDay, updateNotes, getDayData]
  );

  const handleSubmitNewRecord = useCallback(
    async (data: DayDataFormValues) => {
      if (!selectedDay) return;
      const isoDate = moment(selectedDay.date).format("YYYY-MM-DD");
      await addUrinationData(isoDate, data);
      const updated = getDayData(isoDate);
      if (updated) {
        setSelectedDay(updated);
      }
      setIsAddModalOpen(false);
    },
    [selectedDay, addUrinationData, getDayData]
  );

  const handleSubmitEditRecord = useCallback(
    async (data: DayDataFormValues) => {
      if (!selectedDay || editingRecord === null) return;
      const isoDate = moment(selectedDay.date).format("YYYY-MM-DD");
      await editUrinationData(isoDate, editingRecord.index, data);
      const updated = getDayData(isoDate);
      if (updated) {
        setSelectedDay(updated);
      }
      setIsEditModalOpen(false);
      setEditingRecord(null);
    },
    [selectedDay, editingRecord, editUrinationData, getDayData]
  );

  return {
    selectedDay,
    handleDaySelect,
    handleAddRecord,
    handleEditRecord,
    handleDeleteRecord,
    handleUpdateLeakage,
    handleUpdateNotes,
    isAddModalOpen,
    isEditModalOpen,
    editingRecord,
    handleCloseAddModal,
    handleCloseEditModal,
    handleSubmitNewRecord,
    handleSubmitEditRecord,
  };
};
