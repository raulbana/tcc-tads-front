"use client";

import React, { useState } from "react";
import { FlagIcon } from "@phosphor-icons/react";
import useContentQueries from "@/app/contents/services/contentQueryFactory";
import { useAuth } from "@/app/contexts/AuthContext";
import Toast from "@/app/components/Toast/Toast";

interface ReportContentButtonProps {
  contentId: string;
}

const ReportContentButton: React.FC<ReportContentButtonProps> = ({
  contentId,
}) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: "SUCCESS" | "ERROR" | "INFO" | "WARNING";
  }>({
    isOpen: false,
    message: "",
    type: "SUCCESS",
  });

  const queries = useContentQueries(["content"]);
  const reportMutation = queries.useReportContent();

  const handleOpen = () => {
    setReason("");
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      setToast({
        isOpen: true,
        message: "Você precisa estar logado para denunciar uma postagem.",
        type: "ERROR",
      });
      return;
    }

    if (!reason.trim()) {
      setToast({
        isOpen: true,
        message: "Por favor, informe o motivo da denúncia.",
        type: "WARNING",
      });
      return;
    }

    try {
      await reportMutation.mutateAsync({
        contentId,
        reason: reason.trim(),
        userId: String(user.id),
      });

      setToast({
        isOpen: true,
        message: "Denúncia enviada com sucesso. Obrigado por nos avisar.",
        type: "SUCCESS",
      });
      setIsModalOpen(false);
    } catch (error) {
      setToast({
        isOpen: true,
        message:
          "Não foi possível enviar a denúncia no momento. Tente novamente mais tarde.",
        type: "ERROR",
      });
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
        aria-label="Denunciar postagem"
      >
        <FlagIcon className="w-4 h-4" weight="fill" />
        <span>Denunciar</span>
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Denunciar postagem
              </h2>
              <button
                type="button"
                onClick={handleClose}
                className="text-gray-500 hover:text-gray-700"
                aria-label="Fechar modal de denúncia"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <p className="text-sm text-gray-600">
              Explique brevemente o motivo da denúncia. Nossa equipe irá avaliar
              a postagem.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Motivo
                </label>
                <textarea
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  rows={4}
                  className="mt-1 w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                  placeholder="Descreva o que há de inadequado nesta postagem"
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-xl hover:bg-gray-100 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={reportMutation.isPending}
                  className="px-4 py-2 text-sm text-white bg-red-600 hover:bg-red-700 rounded-xl transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {reportMutation.isPending ? "Enviando..." : "Enviar denúncia"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Toast
        type={toast.type}
        message={toast.message}
        isOpen={toast.isOpen}
        onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
      />
    </>
  );
};

export default ReportContentButton;





