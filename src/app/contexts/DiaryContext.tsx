"use client";

import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import diaryServices from "@/app/diary/services/diaryServices";
import {
  CalendarDayData,
  CalendarRangeResponse,
  CalendarRequestDTO,
  LeakageLevel,
  UrinationData,
  mapUrinationDataToDTO,
  ReportDTO,
} from "@/app/types/diary";
import { useAuth } from "@/app/contexts/AuthContext";

interface DiaryContextValue {
  calendarData: CalendarRangeResponse | null;
  isLoading: boolean;
  error: string | null;
  loadCalendarEvents: (from: Date, to: Date) => Promise<void>;
  saveCalendarEvent: (request: CalendarRequestDTO) => Promise<CalendarDayData>;
  addUrinationData: (date: string, urination: UrinationData) => Promise<void>;
  editUrinationData: (date: string, index: number, urination: UrinationData) => Promise<void>;
  deleteUrinationData: (date: string, index: number) => Promise<void>;
  updateLeakageLevel: (date: string, level: LeakageLevel) => Promise<void>;
  updateNotes: (date: string, notes: string) => Promise<void>;
  clearError: () => void;
  getDayData: (date: string) => CalendarDayData | null;
  generateReport: (from: Date, to: Date) => Promise<ReportDTO>;
}

const DiaryContext = createContext<DiaryContextValue | undefined>(undefined);

const calculateLeakageLevel = (urinations: UrinationData[]): LeakageLevel => {
  if (!urinations || urinations.length === 0) return "NONE";
  const leakageCount = urinations.filter(item => item.leakage).length;
  const leakagePercentage = (leakageCount / urinations.length) * 100;
  if (leakagePercentage === 0) return "NONE";
  if (leakagePercentage <= 25) return "LOW";
  if (leakagePercentage <= 75) return "MEDIUM";
  return "HIGH";
};

const toISOStringDate = (date: Date) => date.toISOString().split("T")[0];

export const DiaryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading: authLoading } = useAuth();
  const userId = user?.id ? String(user.id) : undefined;

  const [calendarData, setCalendarData] = useState<CalendarRangeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const ensureUser = useCallback(
    (shouldSetError = true): string | null => {
      if (authLoading) {
        return null;
      }

      if (!userId) {
        if (shouldSetError) {
          setError("Usuário não autenticado");
        }
        return null;
      }

      return userId;
    },
    [authLoading, userId],
  );

  const loadCalendarEvents = useCallback(
    async (from: Date, to: Date) => {
      if (authLoading) {
        setIsLoading(true);
        return;
      }

      const id = ensureUser(true);
      if (!id) {
        setCalendarData(null);
        setIsLoading(false);
        return;
      }
      try {
        setIsLoading(true);
        clearError();
        const data = await diaryServices.getCalendarEvents(from, to, id);
        setCalendarData(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro ao carregar eventos";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [authLoading, clearError, ensureUser],
  );

  const saveCalendarEvent = useCallback(
    async (request: CalendarRequestDTO) => {
      const id = ensureUser();
      if (!id) {
        throw new Error(authLoading ? "Autenticação em andamento" : "Usuário não autenticado");
      }
      try {
        setIsLoading(true);
        clearError();
        const result = await diaryServices.setCalendarEvent(request, id);
        setCalendarData(prev => ({
          ...(prev ?? {}),
          [request.date]: result,
        }));
        return result;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro ao salvar evento";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [authLoading, clearError, ensureUser],
  );

  const addUrinationData = useCallback(
    async (date: string, urination: UrinationData) => {
      const id = ensureUser();
      if (!id) return;
      try {
        setIsLoading(true);
        clearError();
        const currentDay = calendarData?.[date];
        const urinations = [...(currentDay?.urinationData ?? []), urination];
        const leakageLevel = calculateLeakageLevel(urinations);
        const request: CalendarRequestDTO = {
          date,
          leakageLevel,
          notesPreview: currentDay?.notesPreview,
          urinationData: urinations.map(mapUrinationDataToDTO),
        };
        const result = await diaryServices.setCalendarEvent(request, id);
        setCalendarData(prev => ({
          ...(prev ?? {}),
          [date]: result,
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro ao adicionar registro";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [calendarData, clearError, ensureUser],
  );

  const editUrinationData = useCallback(
    async (date: string, index: number, urination: UrinationData) => {
      const id = ensureUser();
      if (!id) return;
      try {
        setIsLoading(true);
        clearError();
        const currentDay = calendarData?.[date];
        if (!currentDay?.urinationData) {
          throw new Error("Dia não encontrado");
        }
        const urinations = [...currentDay.urinationData];
        urinations[index] = urination;
        const leakageLevel = calculateLeakageLevel(urinations);
        const request: CalendarRequestDTO = {
          date,
          leakageLevel,
          notesPreview: currentDay.notesPreview,
          urinationData: urinations.map(mapUrinationDataToDTO),
        };
        const result = await diaryServices.setCalendarEvent(request, id);
        setCalendarData(prev => ({
          ...(prev ?? {}),
          [date]: result,
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro ao editar registro";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [calendarData, clearError, ensureUser],
  );

  const deleteUrinationData = useCallback(
    async (date: string, index: number) => {
      const id = ensureUser();
      if (!id) return;
      try {
        setIsLoading(true);
        clearError();
        const currentDay = calendarData?.[date];
        if (!currentDay?.urinationData) {
          throw new Error("Dia não encontrado");
        }
        const urinations = currentDay.urinationData.filter((_, i) => i !== index);
        const leakageLevel = calculateLeakageLevel(urinations);
        const request: CalendarRequestDTO = {
          date,
          leakageLevel,
          notesPreview: currentDay.notesPreview,
          urinationData: urinations.map(mapUrinationDataToDTO),
        };
        const result = await diaryServices.setCalendarEvent(request, id);
        setCalendarData(prev => ({
          ...(prev ?? {}),
          [date]: result,
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro ao remover registro";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [calendarData, clearError, ensureUser],
  );

  const updateLeakageLevel = useCallback(
    async (date: string, level: LeakageLevel) => {
      const id = ensureUser();
      if (!id) return;
      try {
        setIsLoading(true);
        clearError();
        const currentDay = calendarData?.[date];
        if (!currentDay) {
          throw new Error("Dia não encontrado");
        }
        const request: CalendarRequestDTO = {
          date,
          leakageLevel: level,
          notesPreview: currentDay.notesPreview,
          urinationData: currentDay.urinationData?.map(mapUrinationDataToDTO),
        };
        const result = await diaryServices.setCalendarEvent(request, id);
        setCalendarData(prev => ({
          ...(prev ?? {}),
          [date]: result,
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro ao atualizar nível";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [calendarData, clearError, ensureUser],
  );

  const updateNotes = useCallback(
    async (date: string, notes: string) => {
      const id = ensureUser();
      if (!id) return;
      try {
        setIsLoading(true);
        clearError();
        const currentDay = calendarData?.[date];
        if (!currentDay) {
          throw new Error("Dia não encontrado");
        }
        const request: CalendarRequestDTO = {
          date,
          leakageLevel: currentDay.leakageLevel ?? "NONE",
          notesPreview: notes,
          urinationData: currentDay.urinationData?.map(mapUrinationDataToDTO),
        };
        const result = await diaryServices.setCalendarEvent(request, id);
        setCalendarData(prev => ({
          ...(prev ?? {}),
          [date]: result,
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro ao atualizar notas";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    },
    [calendarData, clearError, ensureUser],
  );

  const getDayData = useCallback(
    (date: string): CalendarDayData | null => {
      return calendarData?.[date] ?? null;
    },
    [calendarData],
  );

  const generateReport = useCallback(
    async (from: Date, to: Date): Promise<ReportDTO> => {
      const id = ensureUser();
      if (!id) {
        throw new Error(authLoading ? "Autenticação em andamento" : "Usuário não autenticado");
      }
      try {
        setIsLoading(true);
        clearError();
        const fromIso = toISOStringDate(from);
        const toIso = toISOStringDate(to);
        return await diaryServices.getReport(fromIso, toIso, id);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erro ao gerar relatório";
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [authLoading, clearError, ensureUser],
  );

  const value = useMemo<DiaryContextValue>(
    () => ({
      calendarData,
      isLoading,
      error,
      loadCalendarEvents,
      saveCalendarEvent,
      addUrinationData,
      editUrinationData,
      deleteUrinationData,
      updateLeakageLevel,
      updateNotes,
      clearError,
      getDayData,
      generateReport,
    }),
    [
      calendarData,
      isLoading,
      error,
      loadCalendarEvents,
      saveCalendarEvent,
      addUrinationData,
      editUrinationData,
      deleteUrinationData,
      updateLeakageLevel,
      updateNotes,
      clearError,
      getDayData,
      generateReport,
    ],
  );

  return <DiaryContext.Provider value={value}>{children}</DiaryContext.Provider>;
};

export const useDiary = (): DiaryContextValue => {
  const context = useContext(DiaryContext);
  if (!context) {
    throw new Error("useDiary deve ser usado dentro de DiaryProvider");
  }
  return context;
};
