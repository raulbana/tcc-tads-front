import React from 'react';
import { Control, Controller } from 'react-hook-form';
import Button from '@/app/components/Button/Button';
import Input from '@/app/components/Input/Input';
import { ICIQAnswers } from '../OnboardingQuestionnaire/schema/questionnaire';
import { Question } from '@/app/types/question';

export interface QuestionProps {
  question: Question;
  control: Control<ICIQAnswers>;
  onContinue: (id: keyof ICIQAnswers) => void;
}

const QuestionSection: React.FC<QuestionProps> = ({
  question,
  control,
  onContinue,
}) => {
  const { id, text: questionText, type, options, min, max, step } = question;

  const validDate = (value?: string | number | string[] | Date) => {
    if (typeof value === 'string') {
      const date = new Date(value);
      return !isNaN(date.getTime()) ? date : null;
    }
    if (typeof value === 'number') {
      const date = new Date(value);
      return !isNaN(date.getTime()) ? date : null;
    }
    if (value instanceof Date) {
      return !isNaN(value.getTime()) ? value : null;
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-8 min-h-96">
      <div className="text-center max-w-2xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          {questionText}
        </h2>
        
        <Controller
          name={id as keyof ICIQAnswers}
          control={control}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <>
              {type === 'text' && (
                <Input
                  value={value as string}
                  onChange={onChange}
                  placeholder="Digite sua resposta"
                  error={error?.message}
                />
              )}
              
              {type === 'date' && (
                <Input
                  type="date"
                  value={validDate(value)?.toISOString().split('T')[0] || ''}
                  onChange={(val) => onChange(new Date(val).toISOString())}
                  error={error?.message}
                />
              )}
              
              {type === 'radio' && (
                <div className="space-y-3">
                  {options?.map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        value={option.value}
                        checked={value === option.value}
                        onChange={() => onChange(option.value)}
                        className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                  {error && <p className="text-red-500 text-sm mt-2">{error.message}</p>}
                </div>
              )}
                
              {type === 'slider' && (
                <div className="w-full max-w-md mx-auto">
                  <input
                    type="range"
                    min={min ?? 0}
                    max={max ?? 10}
                    step={step ?? 1}
                    value={value as number}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>Nada pertinente</span>
                    <span className="font-medium text-purple-600">{value}</span>
                    <span>Muito pertinente</span>
                  </div>
                  {error && <p className="text-red-500 text-sm mt-2">{error.message}</p>}
                </div>
              )}
              
              {type === 'checkbox' && (
                <div className="space-y-3">
                  {options?.map((option) => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        value={option.value}
                        checked={((value as string[]) || []).includes(option.value)}
                        onChange={(e) => {
                          const currentValues = (value as string[]) || [];
                          if (e.target.checked) {
                            onChange([...currentValues, option.value]);
                          } else {
                            onChange(currentValues.filter(v => v !== option.value));
                          }
                        }}
                        className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-gray-700">{option.label}</span>
                    </label>
                  ))}
                  {error && <p className="text-red-500 text-sm mt-2">{error.message}</p>}
                </div>
              )}
            </>
          )}
        />
      </div>
      
      <div className="w-full max-w-md">
        <Button
          type="PRIMARY"
          text="Continuar"
          className="w-full"
          onClick={() => onContinue(id as keyof ICIQAnswers)}
        />
      </div>
    </div>
  );
};

export default QuestionSection;