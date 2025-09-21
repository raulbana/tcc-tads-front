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
    hasTags
  } = usePostDetails(content);

  return (
    <div className="w-full h-full flex flex-col lg:block">
      <div className="flex flex-col lg:grid lg:grid-cols-5 gap-6 h-full overflow-y-scroll ">
        
        <div className="flex-1 lg:col-span-3 lg:overflow-hidden">
          <div className="h-full lg:overflow-y-auto space-y-6 pb-4 lg:pb-0">
            
            <div className="space-y-4">
              <div className="flex flex-col gap-3">
                <PostAuthor
                  authorId={content.authorId}
                  createdAt={formattedDate}
                />
                
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">
                  {content.title}
                </h1>
                
              </div>

              <div className="text-gray-700 leading-relaxed text-sm sm:text-base">
                {content.description}
              </div>
            </div>

            <div className="space-y-4">
              {hasMedia ? (
                <MediaCarousel media={mediaItems} />
              ) : (
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden relative">
                  <Image
                    src={content.coverUrl}
                    alt={content.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {content.subtitle && (
                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  {content.subtitle}
                </p>
              )}

              {content.subcontent && (
                <div className="text-gray-700 leading-relaxed text-sm sm:text-base">
                  {content.subcontent}
                </div>
              )}

              {hasTags && (
                <CategoryBadges tags={content.tags!} />
              )}
            </div>
          </div>
        </div>

        <div className="flex-1 lg:col-span-2 lg:overflow-hidden min-h-0">
          <div className="h-full lg:overflow-y-auto">
            <div className="pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-200">
              <CommentsSection content={content} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;