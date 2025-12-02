"use client";

import React from "react";
import DailyIULogo from "@/app/assets/illustrations/daily-iu-logo.svg";
import ForgotPasswordRequestForm from "./components/ForgotPasswordRequestForm/ForgotPasswordRequestForm";
import ForgotPasswordVerifyForm from "./components/ForgotPasswordVerifyForm/ForgotPasswordVerifyForm";
import useForgotPassword from "./useForgotPassword";
import Link from "next/link";

const ForgotPasswordPage = () => {
  const { step, email, onRequestSuccess, onVerifySuccess, setStep } =
    useForgotPassword();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mb-2 flex w-full justify-center items-center gap-2 text-2xl font-semibold">
            <DailyIULogo /> DailyIU
          </div>
          <div className="text-2xl font-semibold mt-2">
            Esqueci minha senha
          </div>
          <p className="mt-2 text-sm text-gray-600">
            Informe seu e-mail para receber um código de verificação e redefinir
            sua senha.
          </p>
        </div>

        {step === "request" && (
          <ForgotPasswordRequestForm onSuccess={onRequestSuccess} />
        )}

        {step === "verify" && (
          <ForgotPasswordVerifyForm
            email={email}
            onSuccess={onVerifySuccess}
            onBack={() => setStep("request")}
          />
        )}

        <div className="mt-6 text-center text-sm">
          Lembrou sua senha?{" "}
          <Link
            href="/authentication/login"
            className="font-medium text-purple-600 hover:underline"
          >
            Voltar para login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;





