"use client";
import React from "react";
import { ContentCategory } from "@/app/types/content";

interface CategoryChipsProps {
  categories: ContentCategory[];
  selectedCategory: ContentCategory | null;
  onCategorySelect: (categoryId: string | null) => void;
}

const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedCategory,
  onCategorySelect,
}) => {
  return (
    <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
      <button
        onClick={() => onCategorySelect(null)}
        className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
          !selectedCategory
            ? "bg-purple-600 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Todos
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategorySelect(category.id.toString())}
          className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
            selectedCategory?.id === category.id
              ? "bg-purple-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryChips;