import moment from "moment";
import { Content } from "@/app/types/content";

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  alt?: string;
}

export const usePostDetails = () => {
  const formatDate = (date: Date) => {
    return moment(date).format("DD [de] MMMM [de] YYYY");
  };

  const getAllMedia = (content: Content): MediaItem[] => {
    const media: MediaItem[] = [];
    
    if (content.coverUrl) {
      media.push({
        type: 'image',
        url: content.coverUrl,
        alt: content.title
      });
    }

    content.images.forEach((image, index) => {
      media.push({
        type: 'image',
        url: image,
        alt: `${content.title} - Imagem ${index + 1}`
      });
    });

    content.videos.forEach((video, index) => {
      media.push({
        type: 'video',
        url: video,
        alt: `${content.title} - Vídeo ${index + 1}`
      });
    });

    return media;
  };

  return {
    formatDate,
    getAllMedia
  };
};