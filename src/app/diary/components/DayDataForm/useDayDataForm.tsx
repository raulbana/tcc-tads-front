import { useCallback, useEffect } from 'react';
import moment from 'moment';
import { UrinationData } from '@/app/types/diary';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  dayDataFormSchema,
  DayDataRawForm,
  volumeOptions,
  yesNoOptions,
} from '../../schemas/dayDataFormSchema';

export type DayDataFormValues = UrinationData;

export interface UseDayDataFormParams {
  defaultValues?: Partial<DayDataFormValues>;
  onSubmit: (data: DayDataFormValues) => void;
  baseDate?: Date;
}

const buildDefaults = (dv?: Partial<DayDataFormValues>): DayDataRawForm => {
  const time = (() => {
    if (dv?.time) {
      const m = moment(dv.time, 'HH:mm');
      if (m.isValid()) return m.format('HH:mm');
    }
    return moment().format('HH:mm');
  })();
  return {
    time,
    amount: (dv?.amount as DayDataRawForm['amount']) || 'LOW',
    urgency: dv?.urgency === true ? 'YES' : 'NO',
    leakage: dv?.leakage === true ? 'YES' : 'NO',
    reason: dv?.reason || '',
  };
};

export function useDayDataForm({
  defaultValues,
  onSubmit,
}: UseDayDataFormParams) {
  const {
    control,
    handleSubmit,
    formState: { isValid, errors },
    setValue,
    watch,
    reset,
  } = useForm<DayDataRawForm>({
    resolver: zodResolver(dayDataFormSchema),
    mode: 'onChange',
    defaultValues: buildDefaults(defaultValues),
  });

  useEffect(() => {
    reset(buildDefaults(defaultValues));
  }, [reset, defaultValues]);

  const timeString = watch('time');

  const setTimeFromDate = (timeValue: string) => {
    setValue('time', timeValue, { shouldValidate: true });
  };

  const submit = useCallback(
    (data: DayDataRawForm) => {
      onSubmit({
        time: data.time,
        amount: data.amount,
        urgency: data.urgency === 'YES',
        leakage: data.leakage === 'YES',
        reason: data.reason || '',
        observation: defaultValues?.observation ?? '',
      });
    },
    [onSubmit, defaultValues?.observation],
  );

  const handleConfirm = handleSubmit(submit);

  return {
    control,
    errors,
    isValid,
    handleConfirm,
    setTimeFromDate,
    timeString,
    volumeOptions,
    yesNoOptions,
  };
}