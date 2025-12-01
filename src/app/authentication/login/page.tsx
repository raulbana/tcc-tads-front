import React from "react";
import Link from "next/link";
import DailyIULogo from "@/app/assets/illustrations/daily-iu-logo.svg";
import LoginForm from "./components/LoginForm/LoginForm";

const Login = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mb-2 flex w-full justify-center items-center gap-2 text-2xl font-semibold">
            <DailyIULogo /> DailyIU
          </div>
          <div className="text-2xl font-semibold mt-2">Entrar na sua conta</div>
        </div>
        <LoginForm />
        <div className="mt-3 text-right">
          <Link
            href="/authentication/forgot-password"
            className="text-sm text-purple-600 hover:underline"
          >
            Esqueceu sua senha?
          </Link>
        </div>
        <div className="my-6 flex items-center gap-2">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-gray-400 text-sm">ou</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>
        <div className="text-center text-sm">
          Ainda não tem conta?{" "}
          <Link
            href="/authentication/register"
            className="font-medium text-purple-600 hover:underline"
          >
            Criar Conta
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
