"use client";

import React from "react";
import ContentCard from "@/app/contents/components/ContentCard/ContentCard";
import { Content, ContentSimpleDTO } from "@/app/types/content";
import Button from "@/app/components/Button/Button";

export interface ContentListProps {
  contents: Content[];
  isLoading?: boolean;
  onContentClick?: (content: Content) => void;
  onEditContent?: (content: Content) => void;
  onDeleteContent?: (content: Content) => void;
  onUnsaveContent?: (content: Content) => void;
  showActions?: boolean;
  emptyMessage?: string;
}

const ContentList: React.FC<ContentListProps> = ({
  contents,
  isLoading = false,
  onContentClick,
  onEditContent,
  onDeleteContent,
  onUnsaveContent,
  showActions = false,
  emptyMessage = "Nenhum conteúdo encontrado",
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="animate-pulse bg-gray-100 rounded-lg h-64"
          />
        ))}
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {contents.map((content) => {
        const contentId = typeof content.id === 'string' ? parseInt(content.id) : content.id;
        const coverMedia = content.cover || content.media?.[0];
        const contentSimple: ContentSimpleDTO = {
          id: contentId,
          title: content.title,
          author: {
            id: content.author?.id || 0,
            name: content.author?.name || "",
            profilePicture: content.author?.profilePicture,
          },
          categories: content.categories || [],
          cover: coverMedia || {
            id: 0,
            url: '',
            contentType: 'image/jpeg',
            contentSize: 0,
            altText: content.title,
            createdAt: content.createdAt,
          },
          isReposted: content.isReposted || false,
          createdAt: content.createdAt,
          updatedAt: content.updatedAt,
        };

        return (
          <div key={content.id} className="relative group">
            <ContentCard
              content={contentSimple}
              onClick={() => onContentClick?.(content)}
            />
          {showActions && (
            <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {onEditContent && (
                <Button
                  type="SECONDARY"
                  size="SMALL"
                  text="Editar"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditContent(content);
                  }}
                  className="text-xs px-2 py-1"
                />
              )}
              {onDeleteContent && (
                <Button
                  type="SECONDARY"
                  size="SMALL"
                  text="Excluir"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteContent(content);
                  }}
                  className="text-xs px-2 py-1 bg-red-100 text-red-600 hover:bg-red-200"
                />
              )}
              {onUnsaveContent && (
                <Button
                  type="SECONDARY"
                  size="SMALL"
                  text="Remover"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUnsaveContent(content);
                  }}
                  className="text-xs px-2 py-1"
                />
              )}
            </div>
          )}
          </div>
        );
      })}
    </div>
  );
};

export default ContentList;

