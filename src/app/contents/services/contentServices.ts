import { apiFactory } from "@/app/services/apiFactory";
import { API_BASE_URL } from "@/app/config/env";
import { Content, ContentCategory } from "@/app/types/content";

const api = apiFactory(API_BASE_URL);

export interface CreateContentRequest {
  title: string;
  description: string;
  images: File[];
  video?: File;
  categories: string[];
}

export interface UpdateContentRequest extends Partial<CreateContentRequest> {
  id: string;
}

const contentServices = {
  getById: async (contentId: string): Promise<Content> => {
    const response = await api.get(`/contents/${contentId}`);
    return response.data;
  },

  getAll: async (): Promise<Content[]> => {
    const response = await api.get('/contents');
    return response.data;
  },

  getCategories: async (): Promise<ContentCategory[]> => {
    const response = await api.get('/contents/categories');
    return response.data;
  },

  createContent: async (contentData: CreateContentRequest): Promise<Content> => {
    const formData = new FormData();
    
    formData.append('title', contentData.title);
    formData.append('description', contentData.description);
    formData.append('categories', JSON.stringify(contentData.categories));

    contentData.images.forEach((image) => {
      formData.append('images', image);
    });

    if (contentData.video) {
      formData.append('video', contentData.video);
    }

    const response = await api.post('/contents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  updateContent: async (contentData: UpdateContentRequest): Promise<Content> => {
    const formData = new FormData();
    
    if (contentData.title) formData.append('title', contentData.title);
    if (contentData.description) formData.append('description', contentData.description);
    if (contentData.categories) formData.append('categories', JSON.stringify(contentData.categories));

    if (contentData.images) {
      contentData.images.forEach((image) => {
        formData.append('images', image);
      });
    }

    if (contentData.video) {
      formData.append('video', contentData.video);
    }

    const response = await api.put(`/contents/${contentData.id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  },

  deleteContent: async (contentId: string): Promise<void> => {
    await api.delete(`/contents/${contentId}`);
  }
};

export default contentServices;