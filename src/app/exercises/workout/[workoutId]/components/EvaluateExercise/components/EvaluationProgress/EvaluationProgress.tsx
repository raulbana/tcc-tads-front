"use client";
import React from "react";
import ProgressBarStepped from "@/app/components/ProgressBarStepped/ProgressBarStepped";

interface EvaluationProgressProps {
  currentStep: number;
  totalSteps: number;
}

const EvaluationProgress: React.FC<EvaluationProgressProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <div className="mb-6">
      <div className="text-sm text-gray-600 mb-2">
        Etapa {currentStep} de {totalSteps}
      </div>
      <ProgressBarStepped steps={totalSteps} currentStep={currentStep} />
    </div>
  );
};

export default EvaluationProgress;

