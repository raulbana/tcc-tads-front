import React from "react";
import useSwitch from "./useSwitch";

export type SwitchType = "PRIMARY" | "SECONDARY" | "TERTIARY";
export type SwitchSize = "SMALL" | "MEDIUM" | "LARGE";

export interface SwitchProps {
  type?: SwitchType;
  size?: SwitchSize;
  checked: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
  label?: string | React.ReactNode;
  className?: string;
}

const Switch: React.FC<SwitchProps> = ({
  type = "PRIMARY",
  size = "MEDIUM",
  checked,
  onChange,
  disabled = false,
  label,
  className = "",
}) => {
  const { getSwitchColor, getSwitchSize, getTextSize } = useSwitch();

  const baseStyle =
    "relative inline-flex items-center rounded-full transition-colors focus:outline-none focus:ring-2";

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <button
        type="button"
        className={`
          ${baseStyle} 
          ${getSwitchSize(size)} 
          ${getSwitchColor(type, checked)} 
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${className}
        `}
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
      >
        <span
          className={`
            inline-block rounded-full bg-gray-08 shadow-md transform transition-transform
            ${checked ? "translate-x-7" : "translate-x-1"}
            ${getSwitchSize(size, true)}
          `}
        />
      </button>
      {label && <span className={`${getTextSize(size)}`}>{label}</span>}
    </label>
  );
};

export default Switch;
