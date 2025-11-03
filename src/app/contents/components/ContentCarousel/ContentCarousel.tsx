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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {contents.map((content) => (
          <ContentCard
            key={content.id}
            content={content}
            onClick={() => onContentClick(content)}
          />
        ))}
      </div>
    </div>
  );
};

export default ContentCarousel;