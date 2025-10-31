"use client";
import React from "react";
import useRegisterForm from "./useRegisterForm";
import Button from "@/app/components/Button/Button";
import Input from "@/app/components/Input/Input";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    onSubmit,
    acceptTerms,
    watch,
    isSubmitting,
    errorMessage,
    clearError,
  } = useRegisterForm();

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
            onClick={clearError}
            className="ml-2 text-red-800 hover:text-red-900"
          >
            ×
          </button>
        </div>
      )}

      <div>
        <label
          htmlFor="name"
          className="mb-1 block text-sm font-medium text-gray-800"
        >
          Nome
        </label>
        <Input
          type="text"
          {...register("name")}
          value={watch("name")}
          onChange={(value: string) => setValue("name", value)}
          placeholder="Digite seu nome"
          required
          name="name"
          error={errors.name?.message}
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-gray-800"
        >
          E-mail
        </label>
        <Input
          type="email"
          {...register("email")}
          value={watch("email")}
          onChange={(value: string) => setValue("email", value)}
          placeholder="Digite seu e-mail"
          required
          name="email"
          error={errors.email?.message}
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium text-gray-800"
        >
          Senha
        </label>
        <Input
          type="password"
          {...register("password")}
          value={watch("password")}
          onChange={(value: string) => setValue("password", value)}
          placeholder="Digite sua senha"
          required
          name="password"
          error={errors.password?.message}
        />
      </div>
      <div>
        <label
          htmlFor="confirmPassword"
          className="mb-1 block text-sm font-medium text-gray-800"
        >
          Confirmar Senha
        </label>
        <Input
          type="password"
          {...register("confirmPassword")}
          value={watch("confirmPassword")}
          onChange={(value: string) => setValue("confirmPassword", value)}
          placeholder="Confirme sua senha"
          required
          name="confirmPassword"
          error={errors.confirmPassword?.message}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="acceptTerms"
          type="checkbox"
          checked={!!acceptTerms}
          {...register("acceptTerms")}
          onChange={(e) => setValue("acceptTerms", e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        />
        <label htmlFor="acceptTerms" className="text-sm text-gray-700">
          Aceito os termos de uso
        </label>
      </div>
      <Button
        type="PRIMARY"
        text={isSubmitting ? "Criando conta..." : "Criar Conta"}
        className="w-full mt-2"
        disabled={isSubmitting}
        onClick={() => {
          handleSubmit(onSubmit)();
        }}
      />
    </form>
  );
};

export default RegisterForm;
