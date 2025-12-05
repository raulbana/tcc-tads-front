"use client";
import React from "react";
import { Controller } from "react-hook-form";
import useRegisterForm from "./useRegisterForm";
import Button from "@/app/components/Button/Button";
import Input from "@/app/components/Input/Input";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    errors,
    control,
    setValue,
    onSubmit,
    acceptTerms,
    watch,
    isSubmitting,
    errorMessage,
    clearError,
    isSubmitted,
    trigger,
  } = useRegisterForm();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit(onSubmit, (errors) => {
      // Forçar validação de acceptTerms se não foi aceito
      if (!acceptTerms) {
        trigger("acceptTerms");
      }
      // Forçar scroll para o primeiro erro se houver
      if (Object.keys(errors).length > 0) {
        const firstErrorField = Object.keys(errors)[0];
        const errorElement = document.querySelector(
          `[name="${firstErrorField}"]`
        );
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    })(e);
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleFormSubmit}
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
      <div>
        <Controller
          control={control}
          name="acceptTerms"
          render={({ field, fieldState }) => (
            <div className="flex items-start gap-2">
              <input
                id="acceptTerms"
                type="checkbox"
                checked={field.value}
                onChange={(e) => {
                  field.onChange(e.target.checked);
                  if (isSubmitted || errors.acceptTerms) {
                    trigger("acceptTerms");
                  }
                }}
                onBlur={field.onBlur}
                ref={field.ref}
                className={`mt-0.5 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500 ${
                  fieldState.error ? "border-red-500 ring-red-500" : ""
                }`}
              />
              <div className="flex-1">
                <label
                  htmlFor="acceptTerms"
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  Aceito os termos de uso
                </label>
                {(fieldState.error || errors.acceptTerms) && (
                  <p className="text-sm text-red-600 mt-1">
                    {fieldState.error?.message ||
                      errors.acceptTerms?.message ||
                      "Você deve aceitar os termos de uso"}
                  </p>
                )}
              </div>
            </div>
          )}
        />
      </div>
      <Button
        type="PRIMARY"
        buttonType="submit"
        text={isSubmitting ? "Criando conta..." : "Criar Conta"}
        className="w-full mt-2"
        disabled={isSubmitting}
      />
    </form>
  );
};

export default RegisterForm;
