"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import useAdministrationQueries from "../../services/adminQueryFactory";
import Toast, { type ToastType } from "@/app/components/Toast/Toast";

interface ToastState {
  isOpen: boolean;
  message: string;
  type: ToastType;
}

const ComplaintsDashboard = () => {
  const { useComplaints, useValidateComplaint, useApplyStrike } =
    useAdministrationQueries(["administration"]);

  const { data, isLoading, isError, refetch } = useComplaints();
  const validateMutation = useValidateComplaint();
  const strikeMutation = useApplyStrike();

  const [toast, setToast] = useState<ToastState>({
    isOpen: false,
    message: "",
    type: "INFO",
  });

  const showToast = (message: string, type: ToastType = "SUCCESS") => {
    setToast({
      isOpen: true,
      message,
      type,
    });
  };

  const handleValidate = async (
    contentId: number,
    reportId: number,
    valid: boolean
  ) => {
    try {
      await validateMutation.mutateAsync({ contentId, reportId, valid });
      showToast(
        valid
          ? "Denúncia validada com sucesso."
          : "Denúncia rejeitada e conteúdo restaurado.",
        "SUCCESS"
      );
    } catch (error) {
      showToast("Não foi possível atualizar a denúncia.", "ERROR");
    }
  };

  const handleStrike = async (contentId: number) => {
    try {
      await strikeMutation.mutateAsync(contentId);
      showToast("Advertência aplicada ao autor do conteúdo.", "SUCCESS");
    } catch (error) {
      showToast("Não foi possível aplicar a advertência.", "ERROR");
    }
  };

  const hasComplaints = useMemo(() => (data?.length ?? 0) > 0, [data]);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-800">
          Painel de Denúncias
        </h1>
        <p className="text-gray-600">
          Analise as denúncias realizadas pela comunidade e aplique as ações
          necessárias.
        </p>
        <button
          onClick={() => refetch()}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-xl transition cursor-pointer"
        >
          Atualizar lista
        </button>
      </div>

      {isLoading && (
        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-white border border-gray-200 rounded-2xl p-6 space-y-4"
            >
              <div className="h-4 bg-gray-200 rounded w-1/3" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-full" />
              <div className="h-3 bg-gray-200 rounded w-full" />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center">
          Não foi possível carregar as denúncias. Tente novamente mais tarde.
        </div>
      )}

      {!isLoading && !hasComplaints && !isError && (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center">
          <h2 className="text-xl font-semibold text-gray-700">
            Nenhuma denúncia pendente
          </h2>
          <p className="text-gray-500 mt-2">
            Continue acompanhando para garantir a segurança da comunidade.
          </p>
        </div>
      )}

      <div className="space-y-6">
        {data?.map((complaint) => (
          <div
            key={complaint.id}
            className="bg-white border border-gray-200 rounded-2xl shadow-sm"
          >
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {complaint.title}
                  </h2>
                  <p className="text-gray-600">{complaint.description}</p>
                  {complaint.subtitle && (
                    <p className="text-lg font-medium text-gray-700 mt-2">
                      {complaint.subtitle}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleStrike(complaint.id)}
                    disabled={strikeMutation.isPending}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:bg-red-200 rounded-xl transition cursor-pointer"
                  >
                    Aplicar advertência
                  </button>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-sm text-purple-700">
                {complaint.categories.map((category, index) => (
                  <span
                    key={`${category}-${index}`}
                    className="px-3 py-1 bg-purple-100 rounded-full"
                  >
                    {category}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-3">
                {complaint.author.profilePicture && (
                  <img
                    src={complaint.author.profilePicture}
                    alt={complaint.author.name}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Autor: {complaint.author.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    ID do conteúdo: {complaint.id}
                  </p>
                </div>
              </div>
            </div>

            {complaint.subcontent && (
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Conteúdo Completo
                </h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {complaint.subcontent}
                </div>
              </div>
            )}

            {complaint.media && complaint.media.length > 0 && (
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
                  Mídias da Publicação
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {complaint.media
                    .filter((mediaItem) =>
                      mediaItem.contentType?.startsWith("image/")
                    )
                    .map((mediaItem, index) => (
                      <div
                        key={
                          mediaItem.id ||
                          mediaItem.url ||
                          `image-${complaint.id}-${index}`
                        }
                        className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
                      >
                        <Image
                          src={mediaItem.url}
                          alt={mediaItem.altText || complaint.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                    ))}
                </div>
                {complaint.media.filter((m) =>
                  m.contentType?.startsWith("video/")
                ).length > 0 && (
                  <div className="mt-4 space-y-3">
                    {complaint.media
                      .filter((mediaItem) =>
                        mediaItem.contentType?.startsWith("video/")
                      )
                      .map((mediaItem, index) => (
                        <div
                          key={
                            mediaItem.id ||
                            mediaItem.url ||
                            `video-${complaint.id}-${index}`
                          }
                          className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
                        >
                          <video
                            src={mediaItem.url}
                            controls
                            className="w-full h-full object-contain"
                            aria-label={
                              mediaItem.altText || "Vídeo da publicação"
                            }
                          />
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}

            <div className="p-6 space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Denúncias recebidas
              </h3>

              <div className="space-y-3">
                {complaint.reports.map((report) => (
                  <div
                    key={report.id}
                    className="border border-gray-200 rounded-xl p-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
                  >
                    <div>
                      <p className="text-gray-800 font-medium">
                        Motivo: {report.reason}
                      </p>
                      <p className="text-sm text-gray-500">
                        Recebido em:{" "}
                        {new Date(report.createdAt).toLocaleString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() =>
                          handleValidate(complaint.id, report.id, true)
                        }
                        disabled={validateMutation.isPending}
                        className="px-3 py-2 text-sm font-medium text-white bg-green-500 hover:bg-green-600 disabled:bg-green-200 rounded-lg transition cursor-pointer"
                      >
                        Validar
                      </button>
                      <button
                        onClick={() =>
                          handleValidate(complaint.id, report.id, false)
                        }
                        disabled={validateMutation.isPending}
                        className="px-3 py-2 text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 disabled:bg-purple-50 rounded-lg transition cursor-pointer"
                      >
                        Rejeitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Toast
        type={toast.type}
        message={toast.message}
        isOpen={toast.isOpen}
        onClose={() => setToast((state) => ({ ...state, isOpen: false }))}
      />
    </div>
  );
};

export default ComplaintsDashboard;
