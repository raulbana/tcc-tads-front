"use client";
import React from "react";

interface PostAuthorProps {
  authorId: string;
  createdAt: string;
}

const PostAuthor: React.FC<PostAuthorProps> = ({ authorId, createdAt }) => {
  // Mock data - em um app real, isso viria de uma API
  const authorName = `Autor ${authorId}`;
  const authorAvatar = `https://ui-avatars.com/api/?name=${authorName}&background=5F3C6F&color=fff`;

  return (
    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
      <div className="relative w-12 h-12 rounded-full overflow-hidden">
        <img
          src={authorAvatar}
          alt={authorName}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex flex-col">
        <span className="font-semibold text-gray-800">{authorName}</span>
        <span className="text-sm text-gray-600">{createdAt}</span>
      </div>
    </div>
  );
};

export default PostAuthor;