"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/app/components/ProtectedRoute/ProtectedRoute";
import ContentForm from "@/app/contents/components/ContentForm/ContentForm";
import useEditContent from "../useEditContent";
import Button from "@/app/components/Button/Button";

const EditContentByIdPage = () => {
  const params = useParams();
  const router = useRouter();
  const contentId = params?.contentId as string;

  const { content, isLoading, error, goBack } = useEditContent({
    contentId,
  });

  const handleSuccess = (updatedContentId: string) => {
    router.push("/profile");
  };

  const handleError = (errorMessage: string) => {
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 text-lg">Carregando conteúdo...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-8 lg:px-12">
            <div className="bg-white border border-red-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-red-600 mb-2">
                Erro
              </h2>
              <p className="text-gray-600 mb-4">
                {error instanceof Error
                  ? error.message
                  : "Erro ao carregar conteúdo"}
              </p>
              <Button
                type="SECONDARY"
                text="Voltar"
                onClick={goBack}
                className="w-auto"
              />
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!content) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-8 lg:px-12">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Conteúdo não encontrado
              </h2>
              <p className="text-gray-600 mb-4">
                O conteúdo que você está tentando editar não foi encontrado.
              </p>
              <Button
                type="SECONDARY"
                text="Voltar"
                onClick={goBack}
                className="w-auto"
              />
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8 lg:px-12">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Editar Post
            </h1>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <ContentForm
              onSuccess={handleSuccess}
              onError={handleError}
              onCancel={handleCancel}
              initialData={content}
              mode="edit"
              contentId={contentId}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default EditContentByIdPage;




