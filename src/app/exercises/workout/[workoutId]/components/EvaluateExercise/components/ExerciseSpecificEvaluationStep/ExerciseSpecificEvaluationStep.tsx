"use client";
import React from "react";
import { Controller, Control, FieldErrors } from "react-hook-form";
import { ExerciseSpecificEvaluationAnswers } from "../../schema/exerciseEvaluation";
import { QuestionOptions } from "@/app/types/question";
import { Exercise } from "@/app/types/exercise";
import Button from "@/app/components/Button/Button";

interface ExerciseSpecificEvaluationStepProps {
  control: Control<ExerciseSpecificEvaluationAnswers>;
  errors: FieldErrors<ExerciseSpecificEvaluationAnswers>;
  completionOptions: QuestionOptions[];
  currentExercise: Exercise;
  currentExerciseIndex: number;
  totalExercises: number;
  onContinue: () => void;
  onPrevious: () => void;
  isValid: boolean;
  isLastExercise: boolean;
}

const ExerciseSpecificEvaluationStep: React.FC<
  ExerciseSpecificEvaluationStepProps
> = ({
  control,
  errors,
  completionOptions,
  currentExercise,
  currentExerciseIndex,
  totalExercises,
  onContinue,
  onPrevious,
  isLastExercise,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 space-y-6">
      <div className="text-center">
        <div className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-purple-100 text-purple-700 mb-4">
          Exercício {currentExerciseIndex} de {totalExercises}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          {currentExercise.title}
        </h2>
        <p className="text-gray-600">
          Avalie como foi a execução deste exercício
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <p className="text-sm text-gray-600 mb-4">
          Você conseguiu concluir o exercício?
        </p>

        <div className="space-y-3">
          <Controller
            control={control}
            name="completion"
            render={({ field: { onChange, value } }) => (
              <div className="space-y-3">
                {completionOptions.map((option) => (
                  <label
                    key={String(option.value)}
                    className="flex items-center gap-3 cursor-pointer p-3 rounded-lg border-2 transition-colors hover:bg-gray-50"
                    style={{
                      borderColor:
                        value === option.value ? "#5F3C6F" : "#E5E5E5",
                      backgroundColor:
                        value === option.value ? "#F3E8FF" : "transparent",
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
          {errors.completion && (
            <p className="text-red-500 text-sm mt-2">
              {errors.completion.message || "Erro de validação"}
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="SECONDARY"
          text="Voltar"
          onClick={onPrevious}
          className="flex-1"
        />
        <Button
          type="PRIMARY"
          text={isLastExercise ? "Finalizar" : "Continuar"}
          onClick={onContinue}
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default ExerciseSpecificEvaluationStep;
