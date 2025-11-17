"use client";
import React, { useState } from "react";
import Image from "next/image";
import { ContentSimpleDTO } from "@/app/types/content";
import moment from "moment";
import AnonymousUserIcon from "@/app/assets/illustrations/anonymous_user.svg";

interface ContentCardProps {
  content: ContentSimpleDTO;
  onClick?: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, onClick }) => {
  const [imageError, setImageError] = useState(false);
  const formattedDate = moment(content.createdAt).format("DD/MM/YYYY");

  const hasValidMedia = content.cover?.url && !imageError;
  const isVideo = content.cover?.contentType?.startsWith("video/");

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105 hover:shadow-lg"
    >
      <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center">
        {hasValidMedia ? (
          isVideo ? (
            <video
              src={content.cover.url}
              className="w-full h-full object-cover"
              muted
              playsInline
              aria-label={content.cover.altText || content.title}
            />
          ) : (
            <Image
              src={content.cover.url}
              alt={content.cover.altText || content.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />
          )
        ) : (
          <div className="w-24 h-24 text-gray-400">
            <AnonymousUserIcon className="w-full h-full" />
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="mb-2">
          {content.categories && content.categories.length > 0 && (
            <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
              {content.categories[0]}
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
          {content.title}
        </h3>
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <span className="font-medium">{content.author.name}</span>
          </span>
          <span>{formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default ContentCard;
