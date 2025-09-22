import React from "react";
import { CalendarDayData } from "@/app/types/diary";
import RegisterSheets from "@/app/assets/illustrations/register_sheets.svg";
import moment from "moment";

interface DayDetailsEmptyProps {
  selectedDay: CalendarDayData;
}

const DayDetailsEmpty: React.FC<DayDetailsEmptyProps> = ({ selectedDay }) => {
  const formatDate = (date: Date) => {
    return moment(date).format("DD [de] MMMM [de] YYYY");
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 text-center py-8">
      <RegisterSheets />

      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-800">
          {formatDate(selectedDay.date)}
        </h2>
        <p className="text-gray-600">
          Nenhum registro encontrado para esta data
        </p>
        <p className="text-sm text-gray-500">
          Adicione registros para acompanhar seu progresso
        </p>
      </div>
    </div>
  );
};

export default DayDetailsEmpty;