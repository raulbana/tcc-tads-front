"use client";
import React from "react";
import { Content } from "@/app/types/content";
import ContentCard from "../ContentCard/ContentCard";

interface ContentCarouselProps {
  title: string;
  contents: Content[];
  onContentClick?: (content: Content) => void;
}

const ContentCarousel: React.FC<ContentCarouselProps> = ({
  title,
  contents,
  onContentClick,
}) => {
  if (contents.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {contents.map((content) => (
          <ContentCard
            key={content.id}
            content={content}
            onContentClick={onContentClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ContentCarousel;