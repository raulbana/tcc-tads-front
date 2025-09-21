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
    <div className="w-full h-full">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 h-full">
        <div className="lg:col-span-3 flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto">

              <div className="space-y-4">

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-3">

                  <div className="flex-shrink-0 order-first sm:order-last">
                    <PostAuthor
                      authorId={content.authorId}
                      createdAt={formattedDate}
                    />
                  </div>

                  <h1 className="text-2xl font-bold text-gray-800 order-last sm:order-first">{content.title}</h1>

                </div>

                <div className="text-gray-700 leading-relaxed">
                  {content.description}
                </div>

            <div className="space-y-4">
              {hasMedia ? (
                <MediaCarousel media={mediaItems} />
              ) : (
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center relative">
                  <Image
                    src={content.coverUrl}
                    alt={content.title}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              )}

                {content.subtitle && (
                  <p className="text-lg text-gray-600">{content.subtitle}</p>
                )}

                {content.subcontent && (
                  <div className="text-gray-700 leading-relaxed">
                    {content.subcontent}
                  </div>
                )}

                {hasTags && (
                  <CategoryBadges tags={content.tags!} />
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col h-full overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="border-gray-200 pt-4">
              <CommentsSection content={content} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;