"use client";

import React from "react";
import useTalkToUsForm from "./useTalkToUsForm";
import Button from "@/app/components/Button/Button";
import Input from "@/app/components/Input/Input";

const TalkToUsForm = () => {
  const { register, handleSubmit, errors, setValue, onSubmit, watch } =
    useTalkToUsForm();

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
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
        text="Enviar Mensagem"
        className="w-full mt-2"
        onClick={() => {
          handleSubmit(onSubmit)();
        }}
      />
    </form>
  );
};

export default TalkToUsForm;
