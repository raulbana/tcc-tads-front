"use client";

import React from "react";
import { Controller } from "react-hook-form";
import Input from "@/app/components/Input/Input";
import Button from "@/app/components/Button/Button";

export interface ProfileFormProps {
  errors: any;
  isValid: boolean;
  register: any;
  control: any;
  isSaving: boolean;
  onSave: () => void;
  onCancel: () => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({
  errors,
  isValid,
  register,
  control,
  isSaving,
  onSave,
  onCancel,
}) => {
  const genderOptions = [
    { label: "Masculino", value: "male" },
    { label: "Feminino", value: "female" },
    { label: "Outro", value: "other" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Informações Pessoais
        </h3>

        <div className="space-y-4">
          <div>
            <Controller
              name="name"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Nome completo"
                  placeholder="Digite seu nome completo"
                  value={value}
                  onChange={onChange}
                  error={errors.name?.message}
                  required
                />
              )}
            />
          </div>

          <div>
            <Controller
              name="email"
              control={control}
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Email"
                  placeholder="Digite seu email"
                  type="email"
                  value={value}
                  onChange={onChange}
                  error={errors.email?.message}
                  required
                  disabled={true}
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sexo
            </label>
            <Controller
              name="gender"
              control={control}
              render={({ field: { onChange, value } }) => (
                <div className="flex gap-4">
                  {genderOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        value={option.value}
                        checked={value === option.value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}
            />
            {errors.gender && (
              <p className="mt-1 text-sm text-red-600">
                {errors.gender.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
        <Button
          type="SECONDARY"
          size="MEDIUM"
          text="Cancelar"
          onClick={onCancel}
          disabled={isSaving}
          className="w-auto min-w-24"
        />
        <Button
          type="PRIMARY"
          size="MEDIUM"
          text={isSaving ? "Salvando..." : "Salvar"}
          onClick={onSave}
          disabled={isSaving || !isValid}
          className="w-auto min-w-24"
        />
      </div>
    </div>
  );
};

export default ProfileForm;
