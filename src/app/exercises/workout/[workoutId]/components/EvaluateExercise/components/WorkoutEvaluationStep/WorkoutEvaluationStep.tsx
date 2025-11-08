"use client";
import React from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { WorkoutEvaluationAnswers } from "../../schema/exerciseEvaluation";
import { QuestionOptions } from "@/app/types/question";
import Button from "@/app/components/Button/Button";

interface WorkoutEvaluationStepProps {
  control: Control<WorkoutEvaluationAnswers>;
  errors: FieldErrors<WorkoutEvaluationAnswers>;
  difficultyOptions: QuestionOptions[];
  onContinue: () => void;
  isValid: boolean;
}

const WorkoutEvaluationStep: React.FC<WorkoutEvaluationStepProps> = ({
  control,
  errors,
  difficultyOptions,
  onContinue,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
      <div className="text-center">
        <div className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-700 mb-4">
          Parabéns!
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Treino concluído!
        </h2>
        <p className="text-gray-600">
          Você está um passo mais perto de uma vida mais autônoma e confiante!
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          Avalie seu treino
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Usaremos essa informação para ajustar a dificuldade dos seus próximos exercícios
        </p>

        <div className="space-y-3">
          <Controller
            control={control}
            name="difficulty"
            render={({ field: { onChange, value } }) => (
              <div className="space-y-3">
                {difficultyOptions.map((option) => (
                  <label
                    key={String(option.value)}
                    className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 transition-colors hover:bg-gray-50"
                    style={{
                      borderColor:
                        value === option.value ? "#5F3C6F" : "#E5E5E5",
                      backgroundColor: value === option.value ? "#F3E8FF" : "transparent",
                    }}
                  >
                    <input
                      type="radio"
                      value={String(option.value)}
                      checked={value === option.value}
                      onChange={() => onChange(option.value as any)}
                      className="w-4 h-4 text-purple-04 border-gray-300 focus:ring-purple-04 focus:ring-2"
                      style={{ accentColor: "#5F3C6F" }}
                    />
                    <span className="text-gray-700 font-medium">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          />
          {errors.difficulty && (
            <p className="text-red-500 text-sm mt-2">
              {errors.difficulty.message || 'Erro de validação'}
            </p>
          )}
        </div>
      </div>

      <Button
        type="PRIMARY"
        text="Continuar"
        onClick={onContinue}
        className="w-full"
      />
    </div>
  );
};

export default WorkoutEvaluationStep;

