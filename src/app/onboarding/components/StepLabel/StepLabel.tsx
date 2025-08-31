import React from 'react';
import { CheckCircleIcon } from '@phosphor-icons/react';

interface StepLabelProps {
  step: number;
  totalSteps: number;
}

const StepLabel: React.FC<StepLabelProps> = ({ step, totalSteps }) => {
  return (
    <div className="flex items-center justify-center gap-2">
      <CheckCircleIcon size={24} color="var(--color-purple-04)" />
      <span className="text-sm text-gray-700">
        Etapa <span className="font-semibold">{step}</span>
        <span className="text-gray-500"> / {totalSteps}</span>
      </span>
    </div>
  );
};

export default StepLabel;