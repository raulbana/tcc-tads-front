import React from "react";
import useInput from "./useInput";

export type InputType =
  | "text"
  | "date"
  | "time"
  | "number"
  | "email"
  | "password"
  | "textarea";

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  type?: InputType;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  disabled,
  error,
  className = "",
  ...rest
}) => {
  const { getInputStyle, getLabelStyle, getErrorStyle } = useInput();

  return (
    <div className="w-full flex flex-col">
      {label && (
        <label className={getLabelStyle()}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`${getInputStyle(
            !!error,
            disabled
          )} h-32 resize-y overflow-y-auto ${className}`}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`${getInputStyle(!!error, disabled)} ${className}`}
          {...rest}
        />
      )}

      {error && <span className={getErrorStyle()}>{error}</span>}
    </div>
  );
};

export default Input;
