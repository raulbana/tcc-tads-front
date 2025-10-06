"use client";
import React from "react";
import Image from "next/image";

interface PostAuthorProps {
  authorId: string;
  createdAt: string;
}

const PostAuthor: React.FC<PostAuthorProps> = ({ authorId, createdAt }) => {
  // Mock data
  const authorName = `Autor fe ee gefeferferferfefer fefe f  ${authorId}`;
  const authorAvatar = `https://ui-avatars.com/api/?name=UA&background=A97EAA&color=FFFFFF`;

  return (
    <div className="flex items-center gap-3 rounded-lg">
      <div className="relative w-12 h-12 rounded-full overflow-hidden">
        <Image
          src={authorAvatar}
          alt={authorName}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>

      <div className="flex flex-col">
        <span className="font-semibold text-gray-08">{authorName}</span>
        <span className="text-sm text-gray-07">{createdAt}</span>
      </div>
    </div>
  );
};

export default PostAuthor;