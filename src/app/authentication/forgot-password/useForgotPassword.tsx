"use client";

import { useState } from "react";

type ForgotPasswordStep = "request" | "verify";

const useForgotPassword = () => {
  const [step, setStep] = useState<ForgotPasswordStep>("request");
  const [email, setEmail] = useState<string>("");

  const onRequestSuccess = (requestEmail: string) => {
    setEmail(requestEmail);
    setStep("verify");
  };

  const onVerifySuccess = () => {
    setStep("request");
    setEmail("");
  };

  const goBackToLogin = () => {
    setEmail("");
  };

  return {
    step,
    email,
    setStep,
    onRequestSuccess,
    onVerifySuccess,
    goBackToLogin,
  };
};

export default useForgotPassword;





