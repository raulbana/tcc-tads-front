"use client";
import React, { useState } from "react";
import Image from "next/image";
import { AuthorDTO } from "@/app/types/content";
import AnonymousUserIcon from "@/app/assets/illustrations/anonymous_user.svg";

interface PostAuthorProps {
  author: AuthorDTO;
  createdAt: string;
}

const PostAuthor: React.FC<PostAuthorProps> = ({ author, createdAt }) => {
  const [imageError, setImageError] = useState(false);

  const authorInitials = author?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const authorName = author?.name || "Usuário Anônimo";
  const authorAvatar = `https://ui-avatars.com/api/?name=${authorInitials}&background=A97EAA&color=FFFFFF`;

  const hasValidImage = (author?.profilePicture || authorAvatar) && !imageError;

  return (
    <div className="flex items-center gap-3 rounded-lg">
      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
        {hasValidImage ? (
          <Image
            src={author?.profilePicture || authorAvatar}
            alt={author?.name || authorName}
            fill
            className="object-cover"
            sizes="64px"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-8 h-8 text-gray-400">
            <AnonymousUserIcon className="w-full h-full" />
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <span className="font-semibold text-gray-08">{authorName}</span>
        <span className="text-sm text-gray-07">
          {new Date(createdAt).toLocaleDateString("pt-BR")}
        </span>
      </div>
    </div>
  );
};

export default PostAuthor;