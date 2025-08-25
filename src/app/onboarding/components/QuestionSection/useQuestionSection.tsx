import { useState, useEffect } from "react";
import { Control } from "react-hook-form";
import { ICIQAnswers } from "../OnboardingQuestionnaire/schema/questionnaire";
import { Question } from "@/app/types/question";

export interface UseQuestionSectionProps {
  question: Question;
  control: Control<ICIQAnswers>;
  onContinue: (id: keyof ICIQAnswers) => void;
  setValue: (name: keyof ICIQAnswers, value: any) => void;
}

export const useQuestionSection = ({
  question,
  onContinue,
  setValue,
}: UseQuestionSectionProps) => {
  const { id, type, min } = question;

  const [localValue, setLocalValue] = useState<string | number | string[]>(
    () => {
      switch (type) {
        case "text":
          return "";
        case "date":
          return new Date().toISOString();
        case "slider":
          return min || 0;
        case "radio":
          return "";
        case "checkbox":
          return [];
        default:
          return "";
      }
    }
  );

  useEffect(() => {
    setLocalValue(() => {
      switch (type) {
        case "text":
          return "";
        case "date":
          return new Date().toISOString();
        case "slider":
          return min || 0;
        case "radio":
          return "";
        case "checkbox":
          return [];
        default:
          return "";
      }
    });
  }, [id, type, min]);

  const validDate = (value?: string | number | string[] | Date) => {
    if (typeof value === "string") {
      const date = new Date(value);
      return !isNaN(date.getTime()) ? date : null;
    }
    if (typeof value === "number") {
      const date = new Date(value);
      return !isNaN(date.getTime()) ? date : null;
    }
    if (value instanceof Date) {
      return !isNaN(value.getTime()) ? value : null;
    }
    return null;
  };

  const handleContinue = () => {
    setValue(id as keyof ICIQAnswers, localValue);
    onContinue(id as keyof ICIQAnswers);
  };

  const handleTextChange = (value: string) => {
    setLocalValue(value);
    setValue(id as keyof ICIQAnswers, value);
  };

  const handleDateChange = (val: string) => {
    const dateValue = new Date(val).toISOString();
    setLocalValue(dateValue);
    setValue(id as keyof ICIQAnswers, dateValue);
  };

  const handleRadioChange = (value: string) => {
    setLocalValue(value);
    setValue(id as keyof ICIQAnswers, value);
  };

  const handleSliderChange = (value: number) => {
    setLocalValue(value);
    setValue(id as keyof ICIQAnswers, value);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentValues = Array.isArray(localValue) ? localValue : [];
    let newValues: string[];

    if (e.target.checked) {
      newValues = [...currentValues, e.target.value];
    } else {
      newValues = currentValues.filter((v) => v !== e.target.value);
    }

    setLocalValue(newValues);
    setValue(id as keyof ICIQAnswers, newValues);
  };

  const isCheckboxChecked = (optionValue: string) => {
    return Array.isArray(localValue) && localValue.includes(optionValue);
  };

  return {
    localValue,
    validDate,
    handleContinue,
    handleTextChange,
    handleDateChange,
    handleRadioChange,
    handleSliderChange,
    handleCheckboxChange,
    isCheckboxChecked,
  };
};
