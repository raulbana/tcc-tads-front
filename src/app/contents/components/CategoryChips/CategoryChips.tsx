"use client";
import React, { useRef, useState, MouseEvent } from "react";
import { ContentCategory } from "@/app/types/content";

interface CategoryChipsProps {
  categories: ContentCategory[];
  selectedCategories: Set<string>;
  onCategorySelect: (categoryId: string | null) => void;
}

const CategoryChips: React.FC<CategoryChipsProps> = ({
  categories,
  selectedCategories,
  onCategorySelect,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!scrollContainerRef.current) return;

    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollContainerRef.current) return;

    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div
      ref={scrollContainerRef}
      onMouseDown={handleMouseDown}
      onMouseLeave={handleMouseLeave}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      className={`flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide ${
        isDragging ? "cursor-grabbing" : "cursor-grab"
      }`}
      style={{ userSelect: "none" }}
    >
      <button
        onClick={() => onCategorySelect(null)}
        className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors cursor-pointer ${
          selectedCategories.size === 0
            ? "bg-purple-04 text-white"
            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Todos
      </button>
      {categories.map((category) => {
        const isSelected = selectedCategories.has(category.id.toString());
        return (
          <button
            key={category.id}
            onClick={() => onCategorySelect(category.id.toString())}
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              isSelected
                ? "bg-purple-04 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryChips;
