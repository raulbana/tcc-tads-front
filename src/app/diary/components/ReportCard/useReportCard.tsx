"use client";
import { useState } from "react";
import { diaryServices } from "../../services/diaryServices";

export const useReportCard = (onGenerateReport?: () => void) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateReport = async () => {
    setIsGenerating(true);
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      const reportBlob = await diaryServices.generateMonthlyReport(year, month);

      const url = window.URL.createObjectURL(reportBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-${year}-${String(month + 1).padStart(2, '0')}.pdf`;
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateReport = () => {
    if (onGenerateReport) {
      onGenerateReport();
    } else {
      generateReport();
    }
  };

  return {
    isGenerating,
    generateReport,
    handleGenerateReport,
  };
};