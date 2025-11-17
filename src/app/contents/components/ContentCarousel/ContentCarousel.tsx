"use client";
import React from "react";
import ContentCard from "../ContentCard/ContentCard";
import { ContentSimpleDTO } from "@/app/types/content";

interface ContentCarouselProps {
  title: string;
  contents: ContentSimpleDTO[];
  onContentClick: (content: ContentSimpleDTO) => void;
}

const ContentCarousel: React.FC<ContentCarouselProps> = ({
  title,
  contents,
  onContentClick,
}) => {
  if (contents.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
      <div 
        className="overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <div className="flex gap-6 min-w-max px-1">
        {contents.map((content) => (
            <div key={content.id} className="w-64 sm:w-72 flex-shrink-0">
          <ContentCard
            content={content}
            onClick={() => onContentClick(content)}
          />
            </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default ContentCarousel;