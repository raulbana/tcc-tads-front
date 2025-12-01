"use client";
import React, { useState } from "react";
import CategoryChips from "./components/CategoryChips/CategoryChips";
import ContentCarousel from "./components/ContentCarousel/ContentCarousel";
import ContentGrid from "./components/ContentGrid/ContentGrid";
import PostModal from "./components/PostModal/PostModal";
import ContentModal from "./components/ContentModal/ContentModal";
import Button from "../components/Button/Button";
import Toast from "../components/Toast/Toast";
import useContents from "./useContents";

const ContentsPage = () => {
  const {
    categories,
    selectedCategories,
    filteredContents,
    contentSections,
    selectedContent,
    isModalOpen,
    hasActiveFilters,
    handleCategorySelect,
    handleContentClick,
    handleCloseModal,
    refreshContents,
  } = useContents();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
  }>({
    isOpen: false,
    message: "",
  });

  const handleCreateSuccess = (contentId: string) => {
    refreshContents?.();
    setToast({
      isOpen: true,
      message: "Publicação realizada com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 py-8 lg:px-12">
        <div className="mb-8 flex justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Conteúdos</h1>
          </div>

          <Button
            type="PRIMARY"
            text="Novo Post"
            size="MEDIUM"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 max-w-48"
          />
        </div>

        <CategoryChips
          categories={categories}
          selectedCategories={selectedCategories}
          onCategorySelect={handleCategorySelect}
        />

        {hasActiveFilters ? (
          <ContentGrid
            contents={filteredContents}
            onContentClick={handleContentClick}
          />
        ) : (
          <div className="space-y-8">
            {contentSections.length > 0 ? (
              contentSections.map((section) => (
                <ContentCarousel
                  key={section.title}
                  title={section.title}
                  contents={section.contents}
                  onContentClick={handleContentClick}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  Nenhum conteúdo encontrado
                </p>
              </div>
            )}
          </div>
        )}

        <PostModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          content={selectedContent}
        />

        <ContentModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleCreateSuccess}
          mode="create"
        />

        <Toast
          type="SUCCESS"
          message={toast.message}
          isOpen={toast.isOpen}
          onClose={() => setToast((prev) => ({ ...prev, isOpen: false }))}
        />
      </div>
    </div>
  );
};

export default ContentsPage;
