"use client";
import React, { useState } from "react";
import { PlusIcon } from "@phosphor-icons/react";
import CategoryChips from "./components/CategoryChips/CategoryChips";
import ContentCarousel from "./components/ContentCarousel/ContentCarousel";
import PostModal from "./components/PostModal/PostModal";
import ContentModal from "./components/ContentModal/ContentModal";
import Button from "../components/Button/Button";
import useContents from "./useContents";

const ContentsPage = () => {
  const {
    categories,
    selectedCategory,
    contentSections,
    selectedContent,
    isModalOpen,
    handleCategorySelect,
    handleContentClick,
    handleCloseModal,
    refreshContents,
  } = useContents();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateSuccess = (contentId: string) => {
    console.log('Conteúdo criado com sucesso:', contentId);
    refreshContents?.();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Conteúdos</h1>
          </div>
          
          <Button
            type="PRIMARY"
            text="Novo Post"
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2"
          />
        </div>

        <CategoryChips
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategorySelect}
        />

        <div className="space-y-8">
          {contentSections.map((section, index) => (
            <ContentCarousel
              key={index}
              title={section.title}
              contents={section.contents}
              onContentClick={handleContentClick}
            />
          ))}
        </div>

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
      </div>
    </div>
  );
};

export default ContentsPage;