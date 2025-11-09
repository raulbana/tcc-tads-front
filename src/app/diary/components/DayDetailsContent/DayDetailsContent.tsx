import React from "react";
import { CalendarDayData, UrinationData } from "@/app/types/diary";
import { ClockIcon, DropHalfBottomIcon, DropSimpleIcon, ExclamationMarkIcon, PencilIcon, TrashIcon } from "@phosphor-icons/react";
import { useDayDetailsContent } from "./useDayDetailsContent";

interface DayDetailsContentProps {
  selectedDay: CalendarDayData;
  onEditRecord?: (record: UrinationData, index: number) => void;
  onDeleteRecord?: (index: number) => void;
  onUpdateLeakage?: (level: string) => void;
  onUpdateNotes?: (notes: string) => void;
}

const DayDetailsContent: React.FC<DayDetailsContentProps> = ({ 
  selectedDay, 
  onEditRecord,
  onDeleteRecord,
}) => {
  const {
    formatDate,
    getAmountLabel,
    getBadgeColor,
    getLevelLabel,
  } = useDayDetailsContent();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-800">
          {formatDate(selectedDay.date)}
        </h2>

        {selectedDay.leakageLevel && (
          <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(selectedDay.leakageLevel)}`}>
            {getLevelLabel(selectedDay.leakageLevel)}
          </span>
        )}

        {selectedDay.notesPreview && (
          <p className="text-sm text-gray-600">{selectedDay.notesPreview}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Eventos registrados</div>
          <div className="text-2xl font-semibold text-gray-800">
            {selectedDay.eventsCount || selectedDay.urinationData?.length || 0}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-sm text-gray-600">Exercícios concluídos</div>
          <div className="text-2xl font-semibold text-gray-800">
            {selectedDay.completedExercises || 0}
          </div>
        </div>
      </div>

      {selectedDay.urinationData && selectedDay.urinationData.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-800">Registros do dia</h3>
          
          <div className="space-y-3">
            {selectedDay.urinationData.map((record: UrinationData, index: number) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3 relative">

                {onEditRecord && (
                  <button
                    onClick={() => onEditRecord(record, index)}
                    className="absolute top-2 right-10 p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Editar registro"
                  >
                    <PencilIcon className="w-6 h-6 text-gray-500 hover:text-purple-600" />
                  </button>
                )}

                {onDeleteRecord && (
                  <button
                    onClick={() => onDeleteRecord(index)}
                    className="absolute top-2 right-2 p-1 hover:bg-red-50 rounded transition-colors"
                    title="Excluir registro"
                  >
                    <TrashIcon className="w-6 h-6 text-red-500 hover:text-red-600" />
                  </button>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-800">
                      {record.time}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">

                  <div className="flex items-center gap-1">
                    <DropHalfBottomIcon className="w-4 h-4" /> 
                    <span className="text-sm">Volume: {getAmountLabel(record.amount)}</span>
                  </div>

                  {record.leakage && (
                    <div className="flex items-center gap-1">
                      <DropSimpleIcon className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-orange-600">Vazamento</span>
                    </div>
                  )}

                  {record.urgency && (
                    <div className="flex items-center gap-1">
                      <ExclamationMarkIcon className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-600">Urgência</span>
                    </div>
                  )}
                </div>

                {record.reason && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Motivo:</span> {record.reason}
                  </div>
                )}

                {record.observation && (
                  <div className="text-sm text-gray-600 bg-gray-50 rounded p-2">
                    <span className="font-medium">Observação:</span> {record.observation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DayDetailsContent;