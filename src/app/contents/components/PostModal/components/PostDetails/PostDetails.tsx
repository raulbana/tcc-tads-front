"use client";
import React from "react";
import Image from "next/image";
import { Content } from "@/app/types/content";
import { usePostDetails } from "./usePostDetails";
import MediaCarousel from "../MediaCarousel/MediaCarousel";
import PostAuthor from "../PostAuthor/PostAuthor";
import CategoryBadges from "../CategoryBadges/CategoryBadges";
import CommentsSection from "../CommentsSection/CommentsSection";
import moment from "moment";

moment.locale('pt-br');

interface PostDetailsProps {
  content: Content;
}

const PostDetails: React.FC<PostDetailsProps> = ({ content }) => {
  const {
    mediaItems,
    formattedDate,
    hasMedia,
    hasImages,
    hasTags
  } = usePostDetails(content);

  return (
    <div className="w-full h-full">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
        <div className="relative h-full overflow-hidden">
          {hasMedia ? (
            <MediaCarousel media={mediaItems} />
          ) : (
            <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
              <Image
                src={content.coverUrl}
                alt={content.title}
                fill
                className="object-cover rounded-lg"
              />
            </div>
          )}
        </div>

        <div className="flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <PostAuthor
              authorId={content.authorId}
              createdAt={formattedDate}
            />

            <div className="space-y-4 mt-4">
              <h1 className="text-2xl font-bold text-gray-800">{content.title}</h1>
              
              {content.subtitle && (
                <p className="text-lg text-gray-600">{content.subtitle}</p>
              )}

              <div className="text-gray-700 leading-relaxed">
                {content.description}
              </div>

              {content.subcontent && (
                <div className="text-gray-700 leading-relaxed mt-4">
                  {content.subcontent}
                </div>
              )}

              {hasTags && (
                <CategoryBadges tags={content.tags!} />
              )}

              {hasImages && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-800 mb-2">Imagens do post</h3>
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {content.images.map((image, index) => (
                      <div key={index} className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={image}
                          alt={`Imagem ${index + 1}`}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 border-t border-gray-200 pt-4">
                <CommentsSection content={content} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;