"use client";
import React from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import CalendarTile from "../CalendarTile/CalendarTile";
import { CalendarDayData } from "@/app/types/diary";
import { useCalendar } from "./useCalendar";

interface CalendarProps {
  selectedDay?: CalendarDayData;
  onDaySelect: (day: CalendarDayData) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDay, onDaySelect }) => {
  const { monthLabel, rows, goPrevMonth, goNextMonth, isLoading } = useCalendar();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8 h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={goPrevMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Mês anterior"
        >
          <CaretLeftIcon className="w-5 h-5 text-gray-600" />
        </button>

        <h2 className="text-lg font-semibold text-gray-800">
          {monthLabel}
        </h2>

        <button
          onClick={goNextMonth}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Próximo mês"
        >
          <CaretRightIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="space-y-2">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-6 gap-2">
            {row.map((dayItem) => (
              <CalendarTile
                key={dayItem.date.getTime()}
                dayItem={dayItem}
                isSelected={selectedDay?.date.getTime() === dayItem.date.getTime()}
                onPress={() => onDaySelect(dayItem)}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;