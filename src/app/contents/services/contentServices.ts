
import { API_BASE_URL } from "@/app/config/env";
import apiRoutes from "@/app/utils/apiRoutes";
import {
  Content,
  ContentCategory,
  CreateContentRequest,
  UpdateContentRequest,
  ToggleDTO,
  CommentCreatorDTO,
  ReportContentDTO,
  ContentSimpleDTO,
  MediaDTO,
  Comment,
  CreateContentWithFilesRequest,
} from "@/app/types/content";
import { contentCache } from "./contentCache";
import apiFactory from "@/app/services/apiFactory";

const api = apiFactory(API_BASE_URL);

export interface CreateContentRequestService {
  title: string;
  description: string;
  subtitle?: string;
  subcontent?: string;
  categories: number[];
  images: File[];
  video?: File;
}

export interface UpdateContentRequestService extends Partial<CreateContentRequestService> {
  id: string;
}

const contentServices = {
  getById: async (contentId: string, userId: string): Promise<Content> => {
    const cached = contentCache.getContent(contentId);
    if (cached) {
      return cached;
    }

    const headers = {
      'x-user-id': userId,
    };

    const response = await api.get(apiRoutes.content.byId(contentId), {
      headers,
    });

    contentCache.setContent(contentId, response.data);
    return response.data;
  },

  getAll: async (userId: string, profileMode?: boolean): Promise<ContentSimpleDTO[]> => {
    if (!profileMode) {
      const cached = contentCache.getContents();
      if (cached) {
        return cached as unknown as ContentSimpleDTO[];
      }
    }

    const headers: Record<string, string> = {
      'x-user-id': userId,
      ...(profileMode && { 'x-profile': 'true' }),
    };

    const response = await api.get(apiRoutes.content.all, { headers });

    if (!profileMode) {
      contentCache.setContents(response.data);
    }

    return response.data;
  },

  getCategories: async (): Promise<ContentCategory[]> => {
    const cached = contentCache.getCategories();
    if (cached) {
      return cached;
    }

    const response = await api.get(apiRoutes.content.categories);
    contentCache.setCategories(response.data);
    return response.data;
  },

  createContent: async (
    contentData: CreateContentRequest,
    userId: string,
  ): Promise<Content> => {
    const headers = {
      'x-user-id': userId,
    };

    const response = await api.post(apiRoutes.content.create, contentData, {
      headers,
    });
    contentCache.invalidateAll();

    return response.data;
  },

  createContentWithFiles: async (
    contentData: CreateContentWithFilesRequest,
    userId: string,
  ): Promise<Content> => {
    const headers = {
      'x-user-id': userId,
    };

    let uploadedMedia: MediaDTO[] = [];

    if (contentData.files && contentData.files.length > 0) {
      const formData = new FormData();
      contentData.files.forEach((file) => {
        formData.append('files', file as MediaDTO);
      });

      const uploadRes = await contentServices.uploadMedia(formData);
      uploadedMedia = Array.isArray(uploadRes?.media)
        ? uploadRes.media
        : Array.isArray(uploadRes)
        ? uploadRes
        : [];
    }

    const mediaArray = uploadedMedia.map((m) => ({
      url: m.url,
      contentType: m.contentType || m.type,
      contentSize: m.contentSize || 0,
      altText: m.altText || contentData.title,
    }));

    const createRequest = {
      title: contentData.title,
      description: contentData.description,
      subtitle: contentData.subtitle,
      subcontent: contentData.subcontent,
      categoryIds: contentData.categories,
      authorId: parseInt(userId),
      media: mediaArray,
    };

    const response = await api.post(apiRoutes.content.create, createRequest, {
      headers,
    });
    contentCache.invalidateAll();

    return response.data;
  },

  updateContent: async (
    id: string,
    contentData: UpdateContentRequest,
    userId: string,
  ): Promise<Content> => {
    const headers = {
      'x-user-id': userId,
    };

    const updateData = {
      title: contentData.title,
      description: contentData.description,
      subtitle: contentData.subtitle,
      subcontent: contentData.subcontent,
      categoryId: contentData.categories
        ? parseInt(contentData.categories[0])
        : undefined,
    };

    const response = await api.put(apiRoutes.content.update(id), updateData, {
      headers,
    });
    contentCache.invalidateContent(id);

    return response.data;
  },

  deleteContent: async (id: string): Promise<void> => {
    await api.delete(apiRoutes.content.delete(id));
    contentCache.invalidateContent(id);
  },

  toggleLike: async (
    id: string,
    liked: boolean,
    userId: string,
  ): Promise<void> => {
    const toggleData: ToggleDTO = {
      userId: parseInt(userId),
      control: liked,
    };
    await api.patch(apiRoutes.content.like(id), toggleData);
  },

  toggleRepost: async (
    id: string,
    reposted: boolean,
    userId: string,
  ): Promise<void> => {
    const toggleData: ToggleDTO = {
      userId: parseInt(userId),
      control: reposted,
    };
    await api.patch(apiRoutes.content.repost(id), toggleData);
  },

  createComment: async (commentData: CommentCreatorDTO): Promise<void> => {
    await api.post(
      apiRoutes.content.comments(commentData.contentId.toString()),
      commentData,
    );
  },

  reportContent: async (
    contentId: string,
    reason: string,
    userId: string,
  ): Promise<void> => {
    const reportData: ReportContentDTO = {
      reporterId: parseInt(userId),
      reason,
    };
    await api.post(apiRoutes.content.report(contentId), reportData);
  },

  getUserContent: async (userId: string): Promise<Content[]> => {
    const response = await api.get(apiRoutes.content.user(userId));
    return response.data;
  },

  getSavedContent: async (): Promise<Content[]> => {
    const response = await api.get(apiRoutes.content.saved);
    return response.data;
  },

  unsaveContent: async (contentId: string): Promise<void> => {
    await api.patch(apiRoutes.content.save(contentId), { saved: false });
  },

  saveContent: async (contentId: string): Promise<void> => {
    await api.patch(apiRoutes.content.save(contentId), { saved: true });
  },

  toggleSaveContent: async (
    contentId: string,
    userId: string,
    control: boolean,
  ): Promise<void> => {
    await api.patch(apiRoutes.content.save(contentId), {
      userId: parseInt(userId),
      control,
    });
  },

  likeComment: async (commentId: string): Promise<void> => {
    await api.patch(apiRoutes.content.commentLike(commentId));
  },

  getCommentReplies: async (
    commentId: string,
    page: number = 0,
    size: number = 10,
  ): Promise<Comment[]> => {
    const response = await api.get(
      apiRoutes.content.commentReplies(commentId),
      {
        params: { page, size },
      },
    );
    return response.data;
  },

  uploadMedia: async (files: FormData): Promise<MediaDTO> => {
    const headers = {
      'Content-Type': 'multipart/form-data',
    };
    const response = await api.post(apiRoutes.media.upload, files, { headers });
    return response.data;
  },
};

export default contentServices;