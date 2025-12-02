"use client";

import React from "react";
import { useRouter } from "next/navigation";
import ContentCard from "@/app/contents/components/ContentCard/ContentCard";
import { Content, ContentSimpleDTO } from "@/app/types/content";

export interface ContentSelectorProps {
  contents: Content[];
  onSelectContent?: (content: Content) => void;
  isLoading?: boolean;
}

const ContentSelector: React.FC<ContentSelectorProps> = ({
  contents,
  onSelectContent,
  isLoading = false,
}) => {
  const router = useRouter();

  const handleContentClick = (content: Content) => {
    if (onSelectContent) {
      onSelectContent(content);
    } else {
      router.push(`/contents/edit/${content.id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <p className="text-gray-600">Carregando conteúdos...</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse bg-gray-100 rounded-lg h-64"
            />
          ))}
        </div>
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">Nenhum conteúdo encontrado</p>
        <p className="text-gray-500 text-sm mt-2">
          Você ainda não criou nenhum conteúdo para editar.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Selecione um conteúdo para editar
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {contents.map((content) => {
          const contentId =
            typeof content.id === "string" ? parseInt(content.id) : content.id;
          const contentSimple: ContentSimpleDTO = {
            id: contentId,
            title: content.title,
            author: {
              id: content.author?.id || 0,
              name: content.author?.name || "",
              profilePicture: content.author?.profilePicture,
            },
            categories: content.categories || [],
            cover: content.cover || content.media?.[0] || {
              id: 0,
              url: "",
              contentType: "image/jpeg",
              contentSize: 0,
              altText: content.title,
              createdAt: content.createdAt,
            },
            isReposted: content.isReposted || false,
            createdAt: content.createdAt,
            updatedAt: content.updatedAt,
          };

          return (
            <div
              key={content.id}
              onClick={() => handleContentClick(content)}
              className="cursor-pointer"
            >
              <ContentCard content={contentSimple} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContentSelector;


