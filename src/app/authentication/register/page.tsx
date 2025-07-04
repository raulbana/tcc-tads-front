import React from "react";
import Link from "next/link";
import DailyIULogo from "@/app/assets/illustrations/daily-iu-logo.svg";
import RegisterForm from "./components/RegisterForm/RegisterForm";

const Register = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mb-2 flex w-full justify-center items-center gap-2 text-2xl font-semibold">
            <DailyIULogo /> DailyIU
          </div>
          <div className="text-2xl font-semibold mt-2">Criar sua conta</div>
        </div>
        <RegisterForm />
        <div className="my-6 flex items-center gap-2">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-gray-400 text-sm">ou</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
        <div className="text-center text-sm">
          Já tem conta?{" "}
          <Link
            href="/authentication/login"
            className="font-medium text-purple-600 hover:underline"
          >
            Entrar
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
