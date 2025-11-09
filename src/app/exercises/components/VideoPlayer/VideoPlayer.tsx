"use client";
import React, { useState } from "react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  className?: string;
  autoplay?: boolean;
  controls?: boolean;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  className = "",
  autoplay = false,
  controls = true,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className={`relative w-full ${className}`}>
      {hasError ? (
        <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
          <p className="text-gray-500">Erro ao carregar vídeo</p>
        </div>
      ) : (
        <>
          {isLoading && (
            <div className="absolute inset-0 bg-gray-200 rounded-lg flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          )}
          <video
            src={src}
            poster={poster}
            controls={controls}
            autoPlay={autoplay}
            className="w-full rounded-lg"
            onLoadedData={() => setIsLoading(false)}
            onError={() => {
              setHasError(true);
              setIsLoading(false);
            }}
          >
            Seu navegador não suporta o elemento de vídeo.
          </video>
        </>
      )}
    </div>
  );
};

export default VideoPlayer;

