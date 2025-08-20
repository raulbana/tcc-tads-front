import React from 'react';

interface ProgressBarSteppedProps {
  steps: number;
  currentStep: number;
}

const ProgressBarStepped: React.FC<ProgressBarSteppedProps> = ({
  steps,
  currentStep,
}) => {
  const progress = (currentStep / steps) * 100;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">Progresso</span>
        <span className="text-sm text-gray-600">{currentStep} de {steps}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-purple-04 h-2 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBarStepped;