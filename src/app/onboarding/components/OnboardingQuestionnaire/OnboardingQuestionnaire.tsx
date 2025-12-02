"use client";
import React from "react";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import useOnboardingQuestionnaire from "./useOnboardingQuestionnaire";
import ProgressBarStepped from "@/app/components/ProgressBarStepped/ProgressBarStepped";
import StepLabel from "../StepLabel/StepLabel";
import QuestionSection from "../QuestionSection/QuestionSection";

const OnboardingQuestionnaire = () => {
  const {
    questionInputs,
    currentQuestionIndex,
    isLoading,
    errorMessage,
    clearError,
    navigateBack,
  } = useOnboardingQuestionnaire();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={navigateBack}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors cursor-pointer"
          >
            <ArrowLeftIcon size={24} />
            <span className="text-sm">Voltar</span>
          </button>
        </div>

        <div className="space-y-8">
          <ProgressBarStepped
            steps={questionInputs.length}
            currentStep={currentQuestionIndex + 1}
          />

          <StepLabel
            step={currentQuestionIndex + 1}
            totalSteps={questionInputs.length}
          />

          {errorMessage && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {errorMessage}
              <button
                type="button"
                onClick={clearError}
                className="ml-2 text-red-800 hover:text-red-900"
              >
                ×
              </button>
            </div>
          )}

          {questionInputs[currentQuestionIndex] && (
            <QuestionSection
              question={questionInputs[currentQuestionIndex].question}
              control={questionInputs[currentQuestionIndex].control}
              onContinue={questionInputs[currentQuestionIndex].onContinue}
              setValue={questionInputs[currentQuestionIndex].setValue}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingQuestionnaire;
