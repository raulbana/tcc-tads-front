"use client";
import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { ICIQAnswers, iciqSchema } from './schema/questionnaire';
import { QuestionProps } from '../QuestionSection/QuestionSection';

// Mock data - TODO
import { Question } from '@/app/types/question';

// Mock data - TODO
const mockQuestions: Question[] = [
  {
    id: 'birthdate',
    text: 'Qual é a sua data de nascimento?',
    type: 'date',
    required: true
  },
  {
    id: 'gender',
    text: 'Qual é o seu gênero?',
    type: 'radio',
    required: true,
    options: [
      { label: 'Masculino', value: 'male' },
      { label: 'Feminino', value: 'female' },
      { label: 'Outro', value: 'other' }
    ]
  },
  {
    id: 'q3_frequency',
    text: 'Com que frequência você perde urina?',
    type: 'slider',
    required: true,
    min: 0,
    max: 5,
    step: 1
  },
  {
    id: 'q4_amount',
    text: 'Qual a quantidade de urina que você perde?',
    type: 'slider',
    required: true,
    min: 0,
    max: 6,
    step: 1
  },
  {
    id: 'q5_interference',
    text: 'O quanto perder urina interfere na sua vida diária?',
    type: 'slider',
    required: true,
    min: 0,
    max: 10,
    step: 1
  },
  {
    id: 'q6_when',
    text: 'Quando você perde urina?',
    type: 'checkbox',
    required: true,
    options: [
      { label: 'Nunca', value: 'never' },
      { label: 'Antes de chegar ao banheiro', value: 'before_bathroom' },
      { label: 'Quando tusso ou espirro', value: 'cough_sneeze' },
      { label: 'Quando estou dormindo', value: 'sleeping' },
      { label: 'Quando faço atividade física', value: 'exercise' },
      { label: 'Quando termino de urinar e estou me vestindo', value: 'after_urinating' },
      { label: 'Sem razão óbvia', value: 'no_reason' },
      { label: 'O tempo todo', value: 'all_time' }
    ]
  }
];

const useOnboardingQuestionnaire = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const {
    handleSubmit,
    control,
    getFieldState,
    getValues,
    trigger,
    formState: { errors, isValid },
  } = useForm<ICIQAnswers>({
    resolver: zodResolver(iciqSchema),
    mode: 'onChange',
    defaultValues: {
      birthdate: new Date().toISOString(),
      gender: '',
      q3_frequency: 0,
      q4_amount: 0,
      q5_interference: 0,
      q6_when: [],
    },
  });

  const onContinue = useCallback(
    async (field: keyof ICIQAnswers) => {
      const isFieldValid = await trigger(field);

      if (isFieldValid) {
        setCurrentQuestionIndex(prevIndex => {
          const nextIndex = prevIndex + 1;
          if (nextIndex < mockQuestions.length) {
            return nextIndex;
          } else {
            onSubmitAnswer();
            return prevIndex;
          }
        });
      } else {
        const { error } = getFieldState(field);
        setErrorMessage(error?.message ?? 'Campo inválido');
      }
    },
    [getValues, trigger, getFieldState],
  );

  const clearError = () => {
    setErrorMessage('');
  };

  const onSubmitAnswer = useCallback(() => {
    console.log(getValues());
    handleSubmit(() => {
      console.log({
        ...getValues(),
        isValid,
      });
      // Navigate to success page or home
      router.push('/');
    })();
  }, [getValues, handleSubmit, isValid, router]);

  const navigateBack = () => {
    if (currentQuestionIndex === 0) {
      router.push('/onboarding');
    } else {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const questionInputs: QuestionProps[] = mockQuestions.map(question => ({
    question,
    control: control,
    onContinue: () => onContinue(question.id as keyof ICIQAnswers),
  }));

  return {
    questionInputs,
    currentQuestionIndex,
    errorMessage,
    isLoading,
    navigateBack,
    clearError
  };
};

export default useOnboardingQuestionnaire;