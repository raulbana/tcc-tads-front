import React from "react";
import { CalendarDayData } from "@/app/types/diary";
import { useCalendarTile } from "./useCalendarTile";

export interface CalendarTileProps {
  dayItem: CalendarDayData;
  isSelected?: boolean;
  isDisabled?: boolean;
  onPress?: () => void;
  className?: string;
}

const CalendarTile: React.FC<CalendarTileProps> = ({
  dayItem,
  isSelected = false,
  isDisabled = false,
  onPress,
  className = "",
}) => {
  const { dayTitle, dayNumber, isToday, level } = dayItem;
  const { getBadgeColor, getBackgroundColor } = useCalendarTile();

  return (
    <button
      onClick={onPress}
      disabled={isDisabled}
      className={`
        flex flex-col items-center justify-center p-3 rounded-xl gap-1 min-h-[80px] w-full
        ${getBackgroundColor(!!isToday, isSelected)}
        ${isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-100 cursor-pointer"}
        ${isSelected ? "ring-2 ring-purple-400" : ""}
        ${className}
      `}
    >
      <span
        className={`text-xs font-${isToday || isSelected ? "semibold" : "normal"
          } text-gray-800`}
      >
        {dayTitle}
      </span>
      <span
        className={`text-lg font-semibold ${isSelected || isToday ? "text-gray-800" : "text-gray-600"
          }`}
      >
        {dayNumber}
      </span>

      <div
        className={`w-full h-1 rounded-full ${isToday ? "bg-green-500" : getBadgeColor(level)
          }`}
      />
    </button>
  );
};

export default CalendarTile;