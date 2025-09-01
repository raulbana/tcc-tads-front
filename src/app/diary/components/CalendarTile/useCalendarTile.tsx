import { LeakageLevel } from "@/app/types/diary";

export const useCalendarTile = () => {
  const getBadgeColor = (level?: LeakageLevel): string => {
    switch (level) {
      case "NONE":
        return "bg-green-200";
      case "LOW":
        return "bg-blue-200";
      case "MEDIUM":
        return "bg-yellow-200";
      case "HIGH":
        return "bg-red-200";
      default:
        return "bg-gray-200";
    }
  };

  const getBackgroundColor = (isToday: boolean, isSelected: boolean): string => {
    if (isSelected) return "bg-purple-100";
    if (isToday) return "bg-purple-50";
    return "bg-gray-50";
  };

  return {
    getBadgeColor,
    getBackgroundColor,
  };
};