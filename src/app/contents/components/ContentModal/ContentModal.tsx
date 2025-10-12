"use client";
import React from 'react';
import Modal from '@/app/components/Modal/Modal';
import ContentForm from '../ContentForm/ContentForm';
import { Content } from '@/app/types/content';

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (contentId: string) => void;
  initialData?: Partial<Content>;
  mode?: 'create' | 'edit';
  contentId?: string;
}

const ContentModal: React.FC<ContentModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  mode = 'create',
  contentId
}) => {
  const handleSuccess = (contentId: string) => {
    onSuccess?.(contentId);
    onClose();
  };

  const handleError = (error: string) => {
    console.error('Erro no formulário:', error);
    // Aqui você pode adicionar um toast ou notificação de erro
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Novo Post' : 'Editar Post'}
      size="large"
    >
      <div className="max-h-[80vh] overflow-y-auto">
        <ContentForm
          onSuccess={handleSuccess}
          onError={handleError}
          onCancel={onClose}
          initialData={initialData}
          mode={mode}
          contentId={contentId}
        />
      </div>
    </Modal>
  );
};

export default ContentModal;