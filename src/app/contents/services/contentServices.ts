import apiFactory from "@/app/services/apiFactory";
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

const api = apiFactory(API_BASE_URL || "");

const updateCachedContent = (
  contentId: string,
  updater: (content: Content) => Content
) => {
  const cachedContent = contentCache.getContent(contentId);
  if (cachedContent) {
    const updated = updater({ ...cachedContent });
    contentCache.setContent(contentId, updated);
  }

  const cachedList = contentCache.getContents();
  if (cachedList) {
    let hasChanges = false;
    const updatedList = cachedList.map((content) => {
      if (content.id === contentId) {
        hasChanges = true;
        return updater({ ...content });
      }
      return content;
    });

    if (hasChanges) {
      contentCache.setContents(updatedList);
    }
  }
};

const contentServices = {
  getById: async (contentId: string, userId: string): Promise<Content> => {
    const cached = contentCache.getContent(contentId);
    if (cached) {
      return cached;
    }

    const headers = {
      "x-user-id": userId,
    };

    const response = await api.get(apiRoutes.content.byId(contentId), {
      headers,
    });

    contentCache.setContent(contentId, response.data);
    return response.data;
  },

  getAll: async (
    userId: string,
    profileMode?: boolean
  ): Promise<ContentSimpleDTO[]> => {
    if (!profileMode) {
      const cached = contentCache.getContents();
      if (cached) {
        return cached as unknown as ContentSimpleDTO[];
      }
    }

    const headers: Record<string, string> = {
      "x-user-id": userId,
      ...(profileMode && { "x-profile": "true" }),
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
    userId: string
  ): Promise<Content> => {
    const headers = {
      "x-user-id": userId,
    };

    const response = await api.post(apiRoutes.content.create, contentData, {
      headers,
    });
    contentCache.invalidateAll();

    return response.data;
  },

  createContentWithFiles: async (
    contentData: CreateContentWithFilesRequest,
    userId: string
  ): Promise<Content> => {
    const headers = {
      "x-user-id": userId,
    };

    let uploadedMedia: MediaDTO[] = [];

    if (contentData.files && contentData.files.length > 0) {
      const formData = new FormData();
      contentData.files.forEach((file) => {
        formData.append("files", file as any);
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
      contentType: m.contentType || "application/octet-stream",
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
    userId: string
  ): Promise<Content> => {
    const headers = {
      "x-user-id": userId,
    };

    const mediaArray: Array<{
      url: string;
      contentType: string;
      contentSize: number;
      altText?: string;
    }> = [];

    if (contentData.images && contentData.images.length > 0) {
      contentData.images.forEach((url) => {
        const isVideo =
          url.includes(".mp4") || url.includes(".webm") || url.includes(".mov");
        mediaArray.push({
          url,
          contentType: isVideo ? "video/mp4" : "image/jpeg",
          contentSize: 0,
          altText: contentData.title || "",
        });
      });
    }

    if (contentData.video) {
      mediaArray.push({
        url: contentData.video,
        contentType: "video/mp4",
        contentSize: 0,
        altText: contentData.title || "",
      });
    }

    const updateData = {
      title: contentData.title,
      description: contentData.description,
      subtitle: contentData.subtitle,
      subcontent: contentData.subcontent,
      categoryId: contentData.categories
        ? parseInt(contentData.categories[0])
        : undefined,
      media: mediaArray,
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
    userId: string
  ): Promise<void> => {
    const toggleData: ToggleDTO = {
      userId: parseInt(userId),
      control: liked,
    };
    await api.patch(apiRoutes.content.like(id), toggleData);
    updateCachedContent(id, (content) => {
      const wasLiked = content.isLiked ?? false;
      const currentLikes = content.likesCount ?? 0;
      let likesCount = currentLikes;

      if (liked && !wasLiked) {
        likesCount = currentLikes + 1;
      } else if (!liked && wasLiked) {
        likesCount = Math.max(0, currentLikes - 1);
      }

      return {
        ...content,
        isLiked: liked,
        likesCount,
      };
    });
  },

  toggleRepost: async (
    id: string,
    reposted: boolean,
    userId: string
  ): Promise<void> => {
    const toggleData: ToggleDTO = {
      userId: parseInt(userId),
      control: reposted,
    };
    await api.patch(apiRoutes.content.repost(id), toggleData);
  },

  createComment: async (commentData: CommentCreatorDTO): Promise<void> => {
    await api.post(apiRoutes.content.createComment, commentData);
  },

  reportContent: async (
    contentId: string,
    reason: string,
    userId: string
  ): Promise<void> => {
    const reportData: ReportContentDTO = {
      reporterId: parseInt(userId),
      reason,
    };
    await api.post(apiRoutes.content.report(contentId), reportData);
  },

  getUserContent: async (userId: string): Promise<Content[]> => {
    const response = await api.get(apiRoutes.content.all, {
      headers: {
        "x-user-id": userId,
        "x-profile": "true",
      },
    });
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
    userId: number,
    control: boolean
  ): Promise<void> => {
    const toggleData: ToggleDTO = {
      userId,
      control,
    };

    await api.patch(apiRoutes.content.save(contentId), toggleData);
    updateCachedContent(contentId, (content) => ({
      ...content,
      isSaved: control,
    }));
  },

  getComments: async (
    contentId: string,
    userId: string,
    page?: number,
    size?: number
  ): Promise<Comment[]> => {
    const headers = {
      "x-user-id": userId,
    };
    const response = await api.get(apiRoutes.content.comments(contentId), {
      headers,
      params: { page, size },
    });
    return response.data;
  },

  updateComment: async (
    commentId: string,
    text: string,
    userId: string
  ): Promise<Comment> => {
    const headers = {
      "x-user-id": userId,
    };
    const response = await api.put(
      apiRoutes.content.comment(commentId),
      { text },
      { headers }
    );
    return response.data;
  },

  deleteComment: async (commentId: string): Promise<void> => {
    await api.delete(apiRoutes.content.comment(commentId));
  },

  likeComment: async (
    commentId: string,
    userId: number,
    liked: boolean
  ): Promise<void> => {
    const toggleData: ToggleDTO = {
      userId,
      control: liked,
    };
    await api.patch(apiRoutes.content.commentLike(commentId), toggleData);
  },

  getCommentReplies: async (
    commentId: string,
    userId: string,
    page: number = 0,
    size: number = 10
  ): Promise<Comment[]> => {
    const headers = {
      "x-user-id": userId,
    };
    const response = await api.get(
      apiRoutes.content.commentReplies(commentId),
      {
        headers,
        params: { page, size },
      }
    );
    return response.data;
  },

  uploadMedia: async (files: FormData): Promise<any> => {
    const headers = {
      "Content-Type": "multipart/form-data",
    };
    const response = await api.post(apiRoutes.media.upload, files, { headers });
    return response.data;
  },
};

export default contentServices;
