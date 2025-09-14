"use client";
import React from "react";
import { ContentCategory } from "@/app/types/content";
import { XIcon } from "@phosphor-icons/react";

interface CategoryChipsProps {
  categories: ContentCategory[];
  selectedCategory: string | null;
  onCategorySelect: (categoryId: string | null) => void;
}

const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  const handleChipClick = (categoryId: string) => {
    if (selectedCategory === categoryId) {
      onCategorySelect(null);
    } else {
      onCategorySelect(categoryId);
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Categorias</h2>
      <div className="flex gap-3 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleChipClick(category.id)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors
              ${
                selectedCategory === category.id
                  ? "bg-purple-04 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }
            `}
          >
            {category.name}
            {selectedCategory === category.id && (
              <XIcon className="w-4 h-4" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryChips;