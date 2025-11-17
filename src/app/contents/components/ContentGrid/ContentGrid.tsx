"use client";
import React from "react";
import ContentCard from "../ContentCard/ContentCard";
import { ContentSimpleDTO } from "@/app/types/content";

interface ContentGridProps {
  contents: ContentSimpleDTO[];
  onContentClick: (content: ContentSimpleDTO) => void;
}

const ContentGrid: React.FC<ContentGridProps> = ({
  contents,
  onContentClick,
}) => {
  if (contents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">Nenhum conteúdo encontrado</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {contents.map((content) => (
        <ContentCard
          key={content.id}
          content={content}
          onClick={() => onContentClick(content)}
        />
      ))}
    </div>
  );
};

export default ContentGrid;
