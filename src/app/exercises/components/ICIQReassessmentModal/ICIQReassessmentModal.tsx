"use client";
import React, { useEffect, useState } from "react";
import DialogModal from "@/app/components/DialogModal/DialogModal";
import Modal from "@/app/components/Modal/Modal";
import ProgressBarStepped from "@/app/components/ProgressBarStepped/ProgressBarStepped";
import StepLabel from "@/app/onboarding/components/StepLabel/StepLabel";
import QuestionSection from "@/app/onboarding/components/QuestionSection/QuestionSection";
import Button from "@/app/components/Button/Button";
import useICIQReassessment from "./hooks/useICIQReassessment";
import { ICIQReassessmentAnswers } from "./schema/iciqReassessmentSchema";

interface ICIQReassessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ICIQReassessmentModal: React.FC<ICIQReassessmentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [showQuestionsModal, setShowQuestionsModal] = useState(false);

  const {
    questionInputs,
    currentQuestionIndex,
    errorMessage,
    isToastOpen,
    onCloseToast,
    navigateBack,
    isLoading,
    onSubmitAnswer,
    resetForm,
    iciqQuestions,
    onContinue,
  } = useICIQReassessment();

  useEffect(() => {
    if (isOpen) {
      setShowConfirmationDialog(true);
      setShowQuestionsModal(false);
    } else {
      setShowConfirmationDialog(false);
      setShowQuestionsModal(false);
      resetForm();
    }
  }, [isOpen, resetForm]);

  const handleClose = () => {
    resetForm();
    setShowConfirmationDialog(false);
    setShowQuestionsModal(false);
    onClose();
  };

  const handleConfirmReassessment = () => {
    setShowConfirmationDialog(false);
    setShowQuestionsModal(true);
  };

  const handleCancelReassessment = () => {
    setShowConfirmationDialog(false);
    setShowQuestionsModal(false);
    onClose();
  };

  const handleContinue = async () => {
    if (currentQuestionIndex === iciqQuestions.length - 1) {
      const success = await onSubmitAnswer();
      if (success) {
        handleClose();
        onSuccess();
      }
    }
  };

  return (
    <>
      <DialogModal
        isOpen={showConfirmationDialog}
        onClose={handleCancelReassessment}
        title="Reavaliação ICIQ"
        description="Deseja refazer a avaliação ICIQ agora?"
        dismissOnBackdropPress={false}
        secondaryButton={{
          label: "Realizar depois",
          onPress: handleCancelReassessment,
          type: "SECONDARY",
        }}
        primaryButton={{
          label: "Refazer avaliação",
          onPress: handleConfirmReassessment,
          type: "PRIMARY",
          autoClose: false,
        }}
      />

      <Modal
        isOpen={showQuestionsModal}
        onClose={handleClose}
        title="Reavaliação ICIQ"
        size="large"
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="space-y-6 pb-8">
            <ProgressBarStepped
              steps={questionInputs.length}
              currentStep={currentQuestionIndex + 1}
            />

            <div className="flex items-center justify-center">
              <StepLabel
                step={currentQuestionIndex + 1}
                totalSteps={questionInputs.length}
              />
            </div>

            {errorMessage && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {errorMessage}
                <button
                  type="button"
                  onClick={onCloseToast}
                  className="ml-2 text-red-800 hover:text-red-900"
                >
                  ×
                </button>
              </div>
            )}

            {questionInputs[currentQuestionIndex] && (
              <div className="space-y-6">
                <QuestionSection
                  question={questionInputs[currentQuestionIndex].question}
                  control={questionInputs[currentQuestionIndex].control}
                  onContinue={async (field) => {
                    const result = await onContinue(
                      field as keyof ICIQReassessmentAnswers
                    );
                    if (
                      result &&
                      currentQuestionIndex === iciqQuestions.length - 1
                    ) {
                      handleClose();
                      onSuccess();
                    }
                    return result;
                  }}
                  setValue={questionInputs[currentQuestionIndex].setValue}
                />
              </div>
            )}

            {currentQuestionIndex > 0 && (
              <div className="pt-4">
                <Button
                  type="SECONDARY"
                  text="Voltar"
                  onClick={navigateBack}
                  className="m-auto"
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};

export default ICIQReassessmentModal;
