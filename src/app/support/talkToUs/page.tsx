import React from "react";
import DailyIULogo from "@/app/assets/illustrations/daily-iu-logo.svg";
import TalkToUsForm from "./components/talkToUsForm/talkToUsForm";

const TalkToUs = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mb-2 flex w-full justify-center items-center gap-2 text-2xl font-semibold">
            <DailyIULogo />
          </div>
          <div className="text-2xl font-semibold mt-2">Fale Conosco</div>
        </div>
        <TalkToUsForm />
      </div>
    </div>
  );
};

export default TalkToUs;
