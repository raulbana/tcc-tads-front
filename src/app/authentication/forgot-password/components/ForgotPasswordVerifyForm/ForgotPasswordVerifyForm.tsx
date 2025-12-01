"use client";

import React from "react";
import Input from "@/app/components/Input/Input";
import Button from "@/app/components/Button/Button";
import useForgotPasswordVerifyForm from "./useForgotPasswordVerifyForm";

interface ForgotPasswordVerifyFormProps {
  email: string;
  onSuccess: () => void;
  onBack: () => void;
}

const ForgotPasswordVerifyForm: React.FC<ForgotPasswordVerifyFormProps> = ({
  email,
  onSuccess,
  onBack,
}) => {
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    watch,
    onSubmit,
    isSubmitting,
    errorMessage,
    successMessage,
    clearMessages,
  } = useForgotPasswordVerifyForm(email, onSuccess);

  const otp = watch("otp");
  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {errorMessage && (
        <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
          {errorMessage}
          <button
            type="button"
            onClick={clearMessages}
            className="ml-2 text-red-800 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      {successMessage && (
        <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-md">
          {successMessage}
          <button
            type="button"
            onClick={clearMessages}
            className="ml-2 text-green-900 hover:text-green-950"
          >
            ×
          </button>
        </div>
      )}

      <p className="text-sm text-gray-600">
        Enviamos um código de verificação para <strong>{email}</strong>. Digite
        o código abaixo e escolha uma nova senha.
      </p>

      <div>
        <label
          htmlFor="otp"
          className="mb-1 block text-sm font-medium text-gray-800"
        >
          Código de verificação
        </label>
        <Input
          type="text"
          {...register("otp")}
          value={otp}
          onChange={(value: string) => setValue("otp", value)}
          placeholder="Digite o código recebido"
          required
          name="otp"
          error={errors.otp?.message}
        />
      </div>

      <div>
        <label
          htmlFor="newPassword"
          className="mb-1 block text-sm font-medium text-gray-800"
        >
          Nova senha
        </label>
        <Input
          type="password"
          {...register("newPassword")}
          value={newPassword}
          onChange={(value: string) => setValue("newPassword", value)}
          placeholder="Digite a nova senha"
          required
          name="newPassword"
          error={errors.newPassword?.message}
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1 block text-sm font-medium text-gray-800"
        >
          Confirmar nova senha
        </label>
        <Input
          type="password"
          {...register("confirmPassword")}
          value={confirmPassword}
          onChange={(value: string) => setValue("confirmPassword", value)}
          placeholder="Confirme a nova senha"
          required
          name="confirmPassword"
          error={errors.confirmPassword?.message}
        />
      </div>

      <div className="flex justify-between gap-3 mt-2">
        <Button
          type="SECONDARY"
          text="Voltar"
          className="w-1/3"
          onClick={onBack}
        />
        <Button
          type="PRIMARY"
          text={isSubmitting ? "Redefinindo..." : "Redefinir senha"}
          className="w-2/3"
          disabled={isSubmitting}
          onClick={() => {
            handleSubmit(onSubmit)();
          }}
        />
      </div>
    </form>
  );
};

export default ForgotPasswordVerifyForm;





