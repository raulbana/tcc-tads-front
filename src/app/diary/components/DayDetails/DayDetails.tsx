import React from "react";
import { CalendarDayData } from "@/app/types/diary";
import Button from "@/app/components/Button/Button";
import DayDetailsContent from "../DayDetailsContent/DayDetailsContent";
import DayDetailsEmpty from "../DayDetailsEmpty/DayDetailsEmpty";


interface DayDetailsProps {
  selectedDay: CalendarDayData;
  onAddRecord: () => void;
}

const DayDetails: React.FC<DayDetailsProps> = ({ selectedDay, onAddRecord }) => {
  const hasRecords = selectedDay.urinationData && selectedDay.urinationData.length > 0;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {hasRecords ? (
          <DayDetailsContent selectedDay={selectedDay} />
        ) : (
          <DayDetailsEmpty selectedDay={selectedDay} />
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <Button
          type="PRIMARY"
          text="Adicionar registro"
          className="w-full"
          onClick={onAddRecord}
        />
      </div>
    </div>
  );
};

export default DayDetails;