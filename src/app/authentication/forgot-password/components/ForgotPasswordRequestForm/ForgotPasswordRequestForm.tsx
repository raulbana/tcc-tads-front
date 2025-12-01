"use client";

import React from "react";
import Input from "@/app/components/Input/Input";
import Button from "@/app/components/Button/Button";
import useForgotPasswordRequestForm from "./useForgotPasswordRequestForm";

interface ForgotPasswordRequestFormProps {
  onSuccess: (email: string) => void;
}

const ForgotPasswordRequestForm: React.FC<ForgotPasswordRequestFormProps> = ({
  onSuccess,
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
  } = useForgotPasswordRequestForm(onSuccess);

  const email = watch("email");

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

      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-gray-800"
        >
          E-mail cadastrado
        </label>
        <Input
          type="email"
          {...register("email")}
          value={email}
          onChange={(value: string) => setValue("email", value)}
          placeholder="Digite seu e-mail"
          required
          name="email"
          error={errors.email?.message}
        />
      </div>

      <Button
        type="PRIMARY"
        text={isSubmitting ? "Enviando..." : "Enviar código"}
        className="w-full mt-2"
        disabled={isSubmitting}
        onClick={() => {
          handleSubmit(onSubmit)();
        }}
      />
    </form>
  );
};

export default ForgotPasswordRequestForm;





