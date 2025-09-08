import React from "react";
import { ArchiveIcon } from '@phosphor-icons/react';
import Button from "@/app/components/Button/Button";
import { useReportCard } from "./useReportCard";

export interface ReportCardProps {
  onGenerateReport?: () => void;
}

const ReportCard: React.FC<ReportCardProps> = ({ onGenerateReport }) => {
  const { isGenerating, handleGenerateReport } = useReportCard(onGenerateReport);

  return (
    <div className="w-full p-6 bg-gray-50 rounded-xl space-y-4">
      <div className="flex items-center gap-3">
        <ArchiveIcon className="w-6 h-6 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-800">
          Relatório Mensal
        </h3>
      </div>

      <p className="text-sm text-gray-600">
        Gere um Relatório Mensal para acompanhar o seu progresso e/ou poder
        apresentar a um profissional para avaliação e tratamento.
      </p>

      <Button
        type="PRIMARY"
        text={isGenerating ? "Gerando..." : "Gerar Relatório"}
        onClick={handleGenerateReport}
        disabled={isGenerating}
        className="w-full"
      />
    </div>
  );
};

export default ReportCard;