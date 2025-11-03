"use client";
import React from "react";
import Image from "next/image";
import { ContentSimpleDTO } from "@/app/types/content";
import moment from "moment";

interface ContentCardProps {
  content: ContentSimpleDTO;
  onClick: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, onClick }) => {
  const formattedDate = moment(content.createdAt).format("DD/MM/YYYY");

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105 hover:shadow-lg"
    >
      <div className="relative h-48 w-full">
        <Image
          src={content.cover?.url || "/placeholder-image.jpg"}
          alt={content.cover?.altText || content.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <div className="mb-2">
          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
            {content.category}
          </span>
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