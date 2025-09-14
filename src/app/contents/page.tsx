"use client";
import React from "react";
import CategoryChips from "./components/CategoryChips/CategoryChips";
import ContentCarousel from "./components/ContentCarousel/ContentCarousel";
import useContents from "./useContents";


const ContentsPage = () => {
  const {
    categories,
    selectedCategory,
    contentSections,
    handleCategorySelect,
    handleContentClick,
  } = useContents();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Conteúdos</h1>
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

        {contentSections.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">
              Nenhum conteúdo encontrado para esta categoria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentsPage;