"use client";
import React from "react";
import useLoginForm from "./useLoginForm";
import Button from "@/app/components/Button/Button";
import Input from "@/app/components/Input/Input";

const LoginForm = () => {
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    onSubmit,
    remember,
    watch,
  } = useLoginForm();
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
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
      <div className="flex items-center gap-2">
        <input
          id="remember"
          type="checkbox"
          checked={!!remember}
          {...register("remember")}
          onChange={(e) => setValue("remember", e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        />
        <label htmlFor="remember" className="text-sm text-gray-700">
          Lembrar de mim
        </label>
      </div>
      <Button
        type="PRIMARY"
        text="Entrar"
        className="w-full mt-2"
        onClick={() => {
          handleSubmit(onSubmit)();
        }}
      />
    </form>
  );
};

export default LoginForm;
