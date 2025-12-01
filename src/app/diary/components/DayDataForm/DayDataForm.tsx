"use client";

import React from 'react';
import { Controller } from 'react-hook-form';
import { useDayDataForm, DayDataFormValues } from './useDayDataForm';
import Input from '@/app/components/Input/Input';
import Button from '@/app/components/Button/Button';
import { volumeOptions, yesNoOptions } from '../../schemas/dayDataFormSchema';

export interface DayDataFormProps {
  defaultValues?: Partial<DayDataFormValues>;
  onSubmit: (data: DayDataFormValues) => void;
  onCancel?: () => void;
  loading?: boolean;
  baseDate?: Date;
}

const DayDataForm: React.FC<DayDataFormProps> = ({
  defaultValues,
  onSubmit,
  onCancel,
  loading,
  baseDate,
}) => {
  const {
    control,
    errors,
    isValid,
    handleConfirm,
    setTimeFromDate,
  } = useDayDataForm({ defaultValues, onSubmit, baseDate });

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Horário *
        </label>
        <Controller
          control={control}
          name="time"
          render={({ field }) => (
            <Input
              type="time"
              value={field.value}
              onChange={(value: string) => {
                field.onChange(value);
                setTimeFromDate(value);
              }}
              error={errors.time?.message}
            />
          )}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Volume *
        </label>
        <Controller
          control={control}
          name="amount"
          render={({ field }) => (
            <div className="grid grid-cols-3 gap-2">
              {volumeOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    field.value === option.value
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    value={option.value}
                    checked={field.value === option.value}
                    onChange={field.onChange}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        />
        {errors.amount && (
          <p className="text-red-500 text-sm mt-1">{errors.amount.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Urgência *
        </label>
        <Controller
          control={control}
          name="urgency"
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-2">
              {yesNoOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    field.value === option.value
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    value={option.value}
                    checked={field.value === option.value}
                    onChange={field.onChange}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        />
        {errors.urgency && (
          <p className="text-red-500 text-sm mt-1">{errors.urgency.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Perda *
        </label>
        <Controller
          control={control}
          name="leakage"
          render={({ field }) => (
            <div className="grid grid-cols-2 gap-2">
              {yesNoOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    field.value === option.value
                      ? 'border-purple-600 bg-purple-50 text-purple-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    value={option.value}
                    checked={field.value === option.value}
                    onChange={field.onChange}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          )}
        />
        {errors.leakage && (
          <p className="text-red-500 text-sm mt-1">{errors.leakage.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Motivo
        </label>
        <Controller
          control={control}
          name="reason"
          render={({ field }) => (
            <Input
              type="textarea"
              value={field.value ?? ''}
              onChange={field.onChange}
              placeholder="Descreva o motivo (opcional)"
              error={errors.reason?.message}
            />
          )}
        />
      </div>

      <div className="flex gap-3 pt-4">
        {onCancel && (
          <Button
            type="SECONDARY"
            text="Cancelar"
            onClick={onCancel}
            className="flex-1"
          />
        )}
        <Button
          type="PRIMARY"
          text="Confirmar"
          onClick={handleConfirm}
          disabled={!isValid || loading}
          className="flex-1"
        />
      </div>
    </div>
  );
};

export default DayDataForm;