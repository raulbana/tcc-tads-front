"use client";

import React, { useState } from "react";
import Image from "next/image";
import { User } from "@/app/types/auth";
import Button from "@/app/components/Button/Button";
import AnonymousUserIcon from "@/app/assets/illustrations/anonymous_user.svg";

export interface ProfileHeaderProps {
  user: User;
  onEditProfile: () => void;
  isEditing?: boolean;
  stats?: {
    likes: number;
    posts: number;
    saved: number;
  };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  user,
  onEditProfile,
  isEditing = false,
  stats,
}) => {
  const [imageError, setImageError] = useState(false);
  const hasProfilePicture =
    user.profilePictureUrl &&
    user.profilePictureUrl.trim() !== "" &&
    !imageError;

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
          {hasProfilePicture ? (
            <Image
              src={user.profilePictureUrl}
              alt={user.name}
              fill
              className="object-cover rounded-full"
              sizes="96px"
              style={{ objectFit: "cover", objectPosition: "center" }}
              onError={() => setImageError(true)}
              unoptimized={user.profilePictureUrl?.startsWith("data:")}
            />
          ) : (
            <AnonymousUserIcon className="w-full h-full text-gray-400" />
          )}
        </div>

        <div className="flex-1 text-center sm:text-left">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{user.name}</h2>
          <p className="text-gray-600 mb-4">{user.email}</p>

          <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800">
                {stats?.likes ?? 0}
              </p>
              <p className="text-sm text-gray-600">Curtidas</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800">
                {stats?.saved ?? 0}
              </p>
              <p className="text-sm text-gray-600">Vídeos Salvos</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-gray-800">
                {stats?.posts ?? 0}
              </p>
              <p className="text-sm text-gray-600">Postagens</p>
            </div>
          </div>
        </div>

        {!isEditing && (
          <div className="w-full sm:w-auto">
            <Button
              type="PRIMARY"
              size="MEDIUM"
              text="Editar Perfil"
              onClick={onEditProfile}
              className="w-full sm:w-auto"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileHeader;
