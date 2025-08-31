import React from "react";

interface SliderProps {
  min?: number;
  max?: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  leftLabel?: string;
  rightLabel?: string;
  showValue?: boolean;
}

const Slider: React.FC<SliderProps> = ({
  min = 0,
  max = 10,
  step = 1,
  value,
  onChange,
  leftLabel = "Mínimo",
  rightLabel = "Máximo",
  showValue = true,
}) => {
  return (
    <div className="w-full max-w-md mx-auto">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
        style={{
          background: `linear-gradient(to right, #5F3C6F 0%, #5F3C6F ${
            (value / max) * 100
          }%, #E5E5E5 ${(value / max) * 100}%, #E5E5E5 100%)`,
        }}
      />
      <div className="flex justify-between text-sm text-gray-500 mt-2">
        <span>{leftLabel}</span>
        {showValue && (
          <span className="font-medium text-purple-04">{value}</span>
        )}
        <span>{rightLabel}</span>
      </div>
    </div>
  );
};

export default Slider;
