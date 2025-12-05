"use client";

import React from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute/ProtectedRoute";
import ContentSelector from "./components/ContentSelector/ContentSelector";
import useEditContent from "./useEditContent";

const EditContentPage = () => {
  const { contentsList, isLoading, handleSelectContent } = useEditContent();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:px-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Editar Conteúdo
            </h1>
            <p className="text-gray-600">
              Selecione um conteúdo para editar
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
            <ContentSelector
              contents={contentsList}
              onSelectContent={handleSelectContent}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default EditContentPage;






