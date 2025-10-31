"use client";

import React from "react";
import useTalkToUsForm from "./useTalkToUsForm";
import Button from "@/app/components/Button/Button";
import Input from "@/app/components/Input/Input";

const TalkToUsForm = () => {
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    onSubmit,
    watch,
    isSubmitting,
    errorMessage,
    successMessage,
    clearMessages,
  } = useTalkToUsForm();

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
        <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
          {successMessage}
          <button
            type="button"
            onClick={clearMessages}
            className="ml-2 text-green-800 hover:text-green-900"
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
          E-mail
        </label>
        <Input
          type="email"
          {...register("email")}
          value={watch("email")}
          onChange={(value: string) => setValue("email", value)}
          placeholder="Email de contato"
          required
          name="email"
          error={errors.email?.message}
        />
      </div>
      <div>
        <label
          htmlFor="subject"
          className="mb-1 block text-sm font-medium text-gray-800"
        >
          Assunto
        </label>
        <Input
          type="text"
          {...register("subject")}
          value={watch("subject")}
          onChange={(value: string) => setValue("subject", value)}
          placeholder="Digite o assunto da mensagem"
          required
          name="subject"
          error={errors.subject?.message}
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="mb-1 block text-sm font-medium text-gray-800"
        >
          Mensagem
        </label>
        <Input
          type="textarea"
          {...register("message")}
          value={watch("message")}
          onChange={(value: string) => setValue("message", value)}
          placeholder="Digite a mensagem"
          required
          name="message"
          error={errors.message?.message}
        />
      </div>

      <Button
        type="PRIMARY"
        text={isSubmitting ? "Enviando..." : "Enviar Mensagem"}
        className="w-full mt-2"
        disabled={isSubmitting}
        onClick={() => {
          handleSubmit(onSubmit)();
        }}
      />
    </form>
  );
};

export default TalkToUsForm;
