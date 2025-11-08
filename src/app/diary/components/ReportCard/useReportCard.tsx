"use client";
import { useState } from "react";
import { useDiary } from "@/app/contexts/DiaryContext";
import { ReportDTO } from "@/app/types/diary";
import { formatTimeToShort } from "@/app/types/diary";

export const useReportCard = (onGenerateReport?: () => void) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateReport: fetchReport } = useDiary();

  const buildReportHtml = (report: ReportDTO) => {
    const rows = report.history
      .map((day) => {
        const urinations = day.urinationData
          ?.map((item) => `${formatTimeToShort(item.time)} - ${item.amount}${item.leakage ? " (escape)" : ""}`)
          .join("<br/>") ?? "";

        return `
          <tr>
            <td>${day.date}</td>
            <td>${day.leakageLevel}</td>
            <td>${day.completedExercises}</td>
            <td>${day.eventsCount}</td>
            <td>${urinations}</td>
          </tr>
        `;
      })
      .join("");

    return `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: -apple-system, Roboto, Arial, sans-serif; padding: 16px; }
            h1 { font-size: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
            th { background: #f5f5f5; text-align: left; }
          </style>
        </head>
        <body>
          <h1>Relatório Miccional</h1>
          <div><strong>Gerado em:</strong> ${new Date(report.generatedAt).toLocaleString()}</div>
          <div><strong>Paciente:</strong> ${report.user.name} | <strong>Idade:</strong> ${report.user.age} | <strong>Gênero:</strong> ${report.user.gender}</div>
          <table>
            <thead>
              <tr>
                <th>Data</th>
                <th>Nível de Escape</th>
                <th>Exercícios</th>
                <th>Eventos</th>
                <th>Micções</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `;
  };

  const generateReportFile = async () => {
    setIsGenerating(true);
    try {
      const currentDate = new Date();
      const from = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const to = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      const report = await fetchReport(from, to);
      const html = buildReportHtml(report);
      const reportBlob = new Blob([html], { type: "text/html" });

      const url = window.URL.createObjectURL(reportBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}.pdf`;
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
      generateReportFile();
    }
  };

  return {
    isGenerating,
    generateReport: generateReportFile,
    handleGenerateReport,
  };
};