"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Button from "@/app/components/Button/Button";
import AnonymousUserIcon from "@/app/assets/illustrations/anonymous_user.svg";

export interface ProfilePictureSectionProps {
  currentPicture?: string;
  onPictureChange: (file: File) => void;
  onRemovePicture: () => void;
}

const ProfilePictureSection: React.FC<ProfilePictureSectionProps> = ({
  currentPicture,
  onPictureChange,
  onRemovePicture,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasProfilePicture = currentPicture && currentPicture.trim() !== "";

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onPictureChange(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
        {hasProfilePicture ? (
          <Image
            src={currentPicture}
            alt="Foto de perfil"
            fill
            className="object-cover"
            sizes="128px"
            style={{
              objectFit: "cover",
              objectPosition: "center",
              width: "100%",
              height: "100%",
            }}
            unoptimized={currentPicture?.startsWith("data:")}
          />
        ) : (
          <AnonymousUserIcon className="w-full h-full text-gray-400" />
        )}
      </div>

      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          type="SECONDARY"
          size="SMALL"
          text="Alterar Foto"
          onClick={handleButtonClick}
          className="w-auto"
        />
        {hasProfilePicture && (
          <Button
            type="SECONDARY"
            size="SMALL"
            text="Remover"
            onClick={onRemovePicture}
            className="w-auto bg-red-100 text-red-600 hover:bg-red-200"
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePictureSection;
