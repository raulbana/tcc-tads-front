import React from "react";
import { Control } from "react-hook-form";
import Button from "@/app/components/Button/Button";
import Input from "@/app/components/Input/Input";
import Slider from "@/app/components/Slider/Slider";
import { ICIQAnswers } from "../OnboardingQuestionnaire/schema/questionnaire";
import { Question } from "@/app/types/question";
import { useQuestionSection } from "./useQuestionSection";

export interface QuestionProps {
  question: Question;
  control: Control<ICIQAnswers>;
  onContinue: (id: keyof ICIQAnswers) => void;
  setValue: <K extends keyof ICIQAnswers>(
    name: K,
    value: ICIQAnswers[K]
  ) => void;
}

const QuestionSection: React.FC<QuestionProps> = ({
  question,
  control,
  onContinue,
  setValue,
}) => {
  const { text: questionText, type, options, min, max, step } = question;

  const {
    localValue,
    validDate,
    handleContinue,
    handleTextChange,
    handleDateChange,
    handleRadioChange,
    handleSliderChange,
    handleCheckboxChange,
    isCheckboxChecked,
    fieldError,
  } = useQuestionSection({ question, control, onContinue, setValue });

  return (
    <div className="flex flex-col items-center justify-center gap-8 min-h-96">
      <div className="text-center max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {questionText}
        </h2>

        {type === "text" && (
          <Input
            value={localValue as string}
            onChange={handleTextChange}
            placeholder="Digite sua resposta"
            error={fieldError?.message}
            required={question.required}
          />
        )}

        {type === "date" && (
          <Input
            type="date"
            value={validDate(localValue)?.toISOString().split("T")[0] || ""}
            onChange={handleDateChange}
            error={fieldError?.message}
            required={question.required}
          />
        )}

        {type === "radio" && (
          <div className="space-y-3">
            {options?.map((option) => {
              const optionValue = typeof option.value === 'number' ? option.value : Number(option.value);
              const currentValue = typeof localValue === 'number' ? localValue : Number(localValue);
              const isChecked = !isNaN(optionValue) && !isNaN(currentValue) 
                ? optionValue === currentValue 
                : localValue === option.value;
              
              return (
                <label
                  key={String(option.value)}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    value={String(option.value)}
                    checked={isChecked}
                    onChange={() => handleRadioChange(String(option.value))}
                    className="w-4 h-4 text-purple-04 border-gray-300 focus:ring-purple-04 focus:ring-2 focus:ring-offset-2"
                    style={{
                      accentColor: "#5F3C6F",
                    }}
                  />
                  <span className="text-gray-700">{option.label}</span>
                </label>
              );
            })}
            {fieldError && (
              <p className="text-red-500 text-sm mt-2">{fieldError.message}</p>
            )}
          </div>
        )}

        {type === "slider" && (
          <div className="w-full max-w-md mx-auto">
            <Slider
              min={min}
              max={max}
              step={step}
              value={localValue as number}
              onChange={handleSliderChange}
              leftLabel="Nada pertinente"
              rightLabel="Muito pertinente"
            />
            {fieldError && (
              <p className="text-red-500 text-sm mt-2 text-center">
                {fieldError.message}
              </p>
            )}
          </div>
        )}

        {type === "checkbox" && (
          <div className="space-y-3">
            {options?.map((option) => (
              <label
                key={String(option.value)}
                className="flex items-center gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  value={String(option.value)}
                  checked={isCheckboxChecked(String(option.value))}
                  onChange={handleCheckboxChange}
                  className="w-4 h-4 text-purple-04 border-gray-300 rounded focus:ring-purple-04 focus:ring-2 focus:ring-offset-2"
                  style={{
                    accentColor: "#5F3C6F",
                  }}
                />
                <span className="text-gray-700">{option.label}</span>
              </label>
            ))}
            {fieldError && (
              <p className="text-red-500 text-sm mt-2">{fieldError.message}</p>
            )}
          </div>
        )}
      </div>

      <div className="w-full max-w-md">
        <Button
          type="PRIMARY"
          text="Continuar"
          className="w-full"
          onClick={handleContinue}
        />
      </div>
    </div>
  );
};

export default QuestionSection;
