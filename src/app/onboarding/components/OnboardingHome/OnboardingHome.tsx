"use client";
import React from "react";
import Button from "@/app/components/Button/Button";
import useOnboardingHome from "./useOnboardingHome";

const OnboardingHome = () => {
  const { navigateToQuestionnaire } = useOnboardingHome();

  return (
    <div className="flex flex-col items-center justify-center min-h-96 gap-8 p-8">
      <div className="text-center max-w-2xl">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">
          Seja bem-vindo(a) ao DailyIU! Seu app para acompanhamento de{" "}
          <span className="font-bold text-purple-04">
            Incontinência Urinária!
          </span>
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 mt-6">
          Vamos começar?
        </h2>
      </div>

      <div className="w-full max-w-md">
        <Button
          type="PRIMARY"
          text="Continuar"
          className="w-full"
          onClick={navigateToQuestionnaire}
        />
      </div>
    </div>
  );
};

export default OnboardingHome;
