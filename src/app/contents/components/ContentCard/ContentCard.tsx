"use client";
import React from "react";
import Image from "next/image";
import { Content } from "@/app/types/content";

interface ContentCardProps {
  content: Content;
  onContentClick?: (content: Content) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, onContentClick }) => {
  const displayTags = content.tags?.slice(0, 3) || [];

  return (
    <div
      className="relative w-80 h-48 rounded-lg overflow-hidden cursor-pointer group flex-shrink-0"
      onClick={() => onContentClick?.(content)}
    >
      <Image
        src={content.coverUrl}
        alt={content.title}
        fill
        sizes="(max-width: 768px) 100vw, 320px"
        className="object-cover transition-transform group-hover:scale-105"
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {displayTags.length > 0 && (
        <div className="absolute top-3 left-3 flex gap-2">
          {displayTags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 text-xs font-medium rounded-lg bg-purple-02 text-purple-04"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="absolute bottom-4 left-4 right-4 text-white">
        <h3 className="text-lg font-semibold mb-1 line-clamp-2">
          {content.title}
        </h3>
        {content.subtitle && (
          <p className="text-sm text-gray-200 line-clamp-2">
            {content.subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContentCard;