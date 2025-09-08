"use client";

import React from 'react';
import Modal from '@/app/components/Modal/Modal';
import { DayDataFormValues } from '../DayDataForm/useDayDataForm';
import DayDataForm from '../DayDataForm/DayDataForm';

export interface DayDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DayDataFormValues) => void;
  selectedValues?: DayDataFormValues;
  title: string;
  baseDate?: Date;
}

const DayDataModal: React.FC<DayDataModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  selectedValues,
  baseDate,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <DayDataForm
        onSubmit={onSubmit}
        onCancel={onClose}
        defaultValues={selectedValues}
        baseDate={baseDate}
      />
    </Modal>
  );
};

export default DayDataModal;