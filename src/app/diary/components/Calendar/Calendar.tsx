"use client";
import React, { useMemo } from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import CalendarTile from "../CalendarTile/CalendarTile";
import { DayItem } from "@/app/types/diary";
import { useCalendar } from "./useCalendar";

const COLUMNS = 6;

const Calendar: React.FC = () => {
  const { monthLabel, daysFlat, goPrevMonth, goNextMonth, isLoading } = useCalendar();

  const rows = useMemo(() => {
    const out: DayItem[][] = [];
    for (let i = 0; i < daysFlat.length; i += COLUMNS) {
      out.push(daysFlat.slice(i, i + COLUMNS));
    }
    return out;
  }, [daysFlat]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
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
        {rows.map((row, idx) => (
          <div
            key={`row-${idx}`}
            className="grid grid-cols-6 gap-2"
          >
            {row.map((item, j) => (
              <div key={`${item.date.toISOString()}-${j}`}>
                <CalendarTile dayItem={item} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;