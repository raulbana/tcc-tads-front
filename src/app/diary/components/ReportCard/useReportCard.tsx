"use client";
import { useState } from "react";
import { useDiary } from "@/app/contexts/DiaryContext";
import {
  LeakageLevel,
  ReportDTO,
  UrinationAmount,
  formatTimeToShort,
} from "@/app/types/diary";

const LEAKAGE_LEVEL_LABELS: Record<LeakageLevel, string> = {
  NONE: "Nenhum",
  LOW: "Leve",
  MEDIUM: "Moderado",
  HIGH: "Intenso",
};

const URINATION_AMOUNT_LABELS: Record<UrinationAmount, string> = {
  LOW: "Baixo (Até 100ml)",
  MEDIUM: "Médio (100-300ml)",
  HIGH: "Alto (Acima de 300ml)",
};

const translateLeakageLevel = (level?: string | null): string => {
  if (!level) {
    return "Não informado";
  }

  const normalized = level.toUpperCase() as LeakageLevel;
  return LEAKAGE_LEVEL_LABELS[normalized] ?? level;
};

const translateUrinationAmount = (amount?: string | null): string => {
  if (!amount) {
    return "Não informado";
  }

  const normalized = amount.toUpperCase() as UrinationAmount;
  return URINATION_AMOUNT_LABELS[normalized] ?? amount;
};

export const useReportCard = (onGenerateReport?: () => void) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateReport: fetchReport } = useDiary();

  const buildPdf = async (report: ReportDTO): Promise<Blob> => {
    const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");

    const pdfDoc = await PDFDocument.create();
    const pageSize: [number, number] = [595.28, 841.89]; // A4
    let page = pdfDoc.addPage(pageSize);
    let yPosition = page.getHeight() - 60;

    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const addLine = (
      text: string,
      options?: { font?: typeof regularFont; size?: number; indent?: number }
    ) => {
      const { font = regularFont, size = 12, indent = 0 } = options ?? {};
      const lineHeight = size + 6;

      if (yPosition <= 60) {
        page = pdfDoc.addPage(pageSize);
        yPosition = page.getHeight() - 60;
      }

      page.drawText(text, {
        x: 60 + indent,
        y: yPosition,
        size,
        font,
        color: rgb(0, 0, 0),
      });

      yPosition -= lineHeight;
    };

    addLine("Relatório Miccional", { font: boldFont, size: 18 });
    addLine("");
    addLine(`Gerado em: ${new Date(report.generatedAt).toLocaleString()}`, {
      size: 12,
    });
    addLine(
      `Paciente: ${report.user.name} | Idade: ${report.user.age} | Sexo: ${report.user.gender}`,
      { size: 12 }
    );
    addLine("");
    addLine("Histórico", { font: boldFont, size: 14 });
    addLine("");

    report.history.forEach((day) => {
      const leakageLabel = translateLeakageLevel(day.leakageLevel);
      const header = `${day.date} • Nível: ${leakageLabel} • Exercícios: ${day.completedExercises} • Eventos: ${day.eventsCount}`;
      addLine(header, { font: boldFont, size: 12 });

      const urinationSummary =
        day.urinationData
          ?.map((item) => {
            const amountLabel = translateUrinationAmount(item.amount);
            const leakageSuffix = item.leakage ? " (vazamento)" : "";
            return `${formatTimeToShort(
              item.time
            )} - ${amountLabel}${leakageSuffix}`;
          })
          .join("; ") ?? "Sem registros";

      addLine(`Micções: ${urinationSummary}`, { indent: 12 });
      addLine("");
    });

    const pdfBytes = new Uint8Array(await pdfDoc.save());
    return new Blob([pdfBytes.buffer], { type: "application/pdf" });
  };

  const generateReportFile = async () => {
    setIsGenerating(true);
    try {
      const currentDate = new Date();
      const from = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1
      );
      const to = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
      const report = await fetchReport(from, to);
      const reportBlob = await buildPdf(report);

      const url = window.URL.createObjectURL(reportBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `relatorio-${currentDate.getFullYear()}-${String(
        currentDate.getMonth() + 1
      ).padStart(2, "0")}.pdf`;
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erro ao gerar o relatório:", error);
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
