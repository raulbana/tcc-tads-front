"use client";

import React from "react";
import useAccessibilityForm from "./useAccessibilityForm";
import Button from "@/app/components/Button/Button";
import Switch from "@/app/components/Switch/Switch";

const AccessibilityForm = () => {
  const { handleSubmit, errors, setValue, onSubmit, watch, isLoading } =
    useAccessibilityForm();

  const isHighContrast = watch("isHighContrast");
  const isDarkMode = watch("isDarkMode");

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
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

      <div>
        <Switch
          type="PRIMARY"
          size="LARGE"
          label="Modo escuro"
          checked={isDarkMode}
          onChange={(value) => setValue("isDarkMode", value)}
        />
        {errors.isDarkMode && (
          <span className="text-red-500 text-sm">
            {errors.isDarkMode.message as string}
          </span>
        )}
      </div>

      <div>
        <Button
          type="PRIMARY"
          text={isLoading ? "Salvando..." : "Salvar"}
          className="w-full mt-2"
          onClick={() => {
            handleSubmit(onSubmit)();
          }}
          disabled={isLoading}
        />
      </div>
    </form>
  );
};

export default AccessibilityForm;
