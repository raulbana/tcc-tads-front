import React from "react";
import { CalendarDayData, UrinationData } from "@/app/types/diary";
import { ClockIcon, DropSimpleIcon, ExclamationMarkIcon } from "@phosphor-icons/react";
import moment from "moment";

interface DayDetailsContentProps {
  selectedDay: CalendarDayData;
}

const DayDetailsContent: React.FC<DayDetailsContentProps> = ({ selectedDay }) => {
  const formatDate = (date: Date) => {
    return moment(date).format("DD [de] MMMM [de] YYYY");
  };

  const getAmountLabel = (amount: string) => {
    const labels = {
      LOW: "Baixo",
      MEDIUM: "Médio",
      HIGH: "Alto"
    };
    return labels[amount as keyof typeof labels] || amount;
  };

  const getBadgeColor = (level?: string) => {
    switch (level) {
      case "NONE":
        return "bg-green-100 text-green-800";
      case "LOW":
        return "bg-blue-100 text-blue-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "HIGH":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelLabel = (level?: string) => {
    const labels = {
      NONE: "Sem vazamento",
      LOW: "Vazamento baixo",
      MEDIUM: "Vazamento médio",
      HIGH: "Vazamento alto"
    };
    return labels[level as keyof typeof labels] || "Sem classificação";
  };

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
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-800">Registros do dia</h3>

          <div className="space-y-3">
            {selectedDay.urinationData.map((record: UrinationData, index: number) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-800">{record.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <DropSimpleIcon className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-gray-600">
                      Volume: {getAmountLabel(record.amount)}
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  {record.urgency && (
                    <div className="flex items-center gap-1">
                      <ExclamationMarkIcon className="w-4 h-4 text-orange-500" />
                      <span className="text-sm text-orange-600">Urgência</span>
                    </div>
                  )}

                  {record.leakage && (
                    <div className="flex items-center gap-1">
                      <DropSimpleIcon className="w-4 h-4 text-red-500" />
                      <span className="text-sm text-red-600">Vazamento</span>
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