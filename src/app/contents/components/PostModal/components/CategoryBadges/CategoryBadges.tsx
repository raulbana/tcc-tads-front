"use client";
import React from "react";

interface CategoryBadgesProps {
  tags: string[];
}

const CategoryBadges: React.FC<CategoryBadgesProps> = ({ tags }) => {
  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {tags.map((tag, index) => (
        <span
          key={index}
          className="px-3 py-1 text-sm font-medium rounded-full bg-purple-02 text-purple-04"
        >
          {tag}
        </span>
      ))}
    </div>
  );
};

export default CategoryBadges;