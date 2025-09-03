"use client";

import React from "react";
import useAccessibilityForm from "./useAccessibilityForm";
import Button from "@/app/components/Button/Button";
import Switch from "@/app/components/Switch/Switch";

const AccessibilityForm = () => {
  const { register, handleSubmit, errors, setValue, onSubmit, watch } =
    useAccessibilityForm();

  const isHighContrast = watch("isHighContrast");
  const isBigFont = watch("isBigFont");

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      {/* Switch - Alto Contraste */}
      <div>
        <Switch
          type="PRIMARY"
          size="LARGE"
          label="Ativar alto contraste"
          checked={isHighContrast}
          onChange={(value) => setValue("isHighContrast", value)}
        />
        {errors.isHighContrast && (
          <span className="text-red-500 text-sm">
            {errors.isHighContrast.message as string}
          </span>
        )}
      </div>

      {/* Switch - Fonte Aumentada */}
      <div>
        <Switch
          type="PRIMARY"
          size="LARGE"
          label="Fonte aumentada"
          checked={isBigFont}
          onChange={(value) => setValue("isBigFont", value)}
        />
        {errors.isBigFont && (
          <span className="text-red-500 text-sm">
            {errors.isBigFont.message as string}
          </span>
        )}
      </div>

      {/* Botão de salvar */}
      <div>
        <Button
          type="PRIMARY"
          text="Salvar"
          className="w-full mt-2"
          onClick={() => {
            handleSubmit(onSubmit)();
          }}
        />
      </div>
    </form>
  );
};

export default AccessibilityForm;
