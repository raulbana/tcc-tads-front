//import { apiFactory } from "@/app/services/apiFactory";
//import { API_BASE_URL } from "@/app/config/env";
import { Content, ContentCategory } from "@/app/types/content";

//const api = apiFactory(API_BASE_URL);

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

// Mock data para desenvolvimento
const mockCategories: ContentCategory[] = [
  { id: "1", name: "Alimentação e Nutrição", description: "Dicas de alimentos que ajudam na saúde do trato urinário", auditable: false, createdAt: new Date() },
  { id: "2", name: "Hábitos Saudáveis", description: "Rotinas que favorecem o bem-estar", auditable: false, createdAt: new Date() },
  { id: "3", name: "Dicas de Fisioterapia Pélvica", description: "Conteúdos educativos sobre exercícios", auditable: true, createdAt: new Date() },
  { id: "4", name: "Depoimentos e Histórias Reais", description: "Espaço para relatos de superação", auditable: false, createdAt: new Date() },
  { id: "5", name: "Mitos e Verdades", description: "Desmistificação de crenças populares", auditable: true, createdAt: new Date() },
];

const contentServices = {
  getById: async (contentId: string): Promise<Content> => {
    // Simulando delay da API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data - em produção substituir pela chamada real
    const mockContent: Content = {
      id: contentId,
      title: "Título do conteúdo",
      subtitle: "Subtítulo do conteúdo",
      description: "Descrição detalhada do conteúdo",
      subcontent: "Conteúdo adicional do post",
      createdAt: new Date(),
      updatedAt: new Date(),
      coverUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"
      ],
      videos: [],
      category: "1",
      isFavorite: false,
      authorId: "author1",
      tags: ["Saúde", "Bem-estar"],
      comments: []
    };

    // Implementação real
    // const response = await api.get(`/contents/${contentId}`);
    // return response.data;
    
    return mockContent;
  },

  getAll: async (): Promise<Content[]> => {
    // Simulando delay da API
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock data
    const mockContents: Content[] = [
      {
        id: "1",
        title: "5 Alimentos que Fortalecem o Assoalho Pélvico",
        subtitle: "Descubra como a alimentação pode ajudar",
        description: "Uma alimentação adequada pode contribuir significativamente para a saúde do assoalho pélvico.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        coverUrl: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop",
        images: [],
        videos: [],
        category: "1",
        isFavorite: false,
        authorId: "author1",
        tags: ["Alimentação", "Saúde"],
        comments: []
      },
      {
        id: "2",
        title: "Exercícios de Kegel: Guia Completo",
        subtitle: "Aprenda a técnica correta",
        description: "Os exercícios de Kegel são fundamentais para fortalecer a musculatura pélvica.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 horas atrás
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
        coverUrl: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        images: [],
        videos: [],
        category: "3",
        isFavorite: false,
        authorId: "author2",
        tags: ["Exercícios", "Fisioterapia"],
        comments: []
      },
      {
        id: "3",
        title: "Minha Jornada de Superação",
        subtitle: "Um relato pessoal",
        description: "Compartilho aqui como consegui superar as dificuldades e melhorar minha qualidade de vida.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 horas atrás
        updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
        coverUrl: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=300&fit=crop",
        images: [],
        videos: [],
        category: "4",
        isFavorite: true,
        authorId: "author3",
        tags: ["Depoimento", "Superação"],
        comments: []
      }
    ];

    // Implementação real (comentada por enquanto)
    // const response = await api.get('/contents');
    // return response.data;
    
    return mockContents;
  },

  getCategories: async (): Promise<ContentCategory[]> => {
    // Simulando delay da API
    await new Promise(resolve => setTimeout(resolve, 300));

    // Implementação real
    // const response = await api.get('/contents/categories');
    // return response.data;
    
    return mockCategories;
  },

  createContent: async (contentData: CreateContentRequest): Promise<Content> => {
    // Simulando delay de upload
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock da resposta
    const mockResponse: Content = {
      id: `content_${Date.now()}`,
      title: contentData.title,
      description: contentData.description,
      subtitle: "",
      subcontent: "",
      createdAt: new Date(),
      updatedAt: new Date(),
      coverUrl: contentData.images[0] ? URL.createObjectURL(contentData.images[0]) : "",
      images: contentData.images.map(img => URL.createObjectURL(img)),
      videos: contentData.video ? [URL.createObjectURL(contentData.video)] : [],
      category: contentData.categories[0] || "1",
      isFavorite: false,
      authorId: "current_user",
      tags: [],
      comments: []
    };

    // Implementação
    /*
    const formData = new FormData();
    
    formData.append('title', contentData.title);
    formData.append('description', contentData.description);
    formData.append('categories', JSON.stringify(contentData.categories));

    contentData.images.forEach((image, index) => {
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
    */

    return mockResponse;
  },

  updateContent: async (contentData: UpdateContentRequest): Promise<Content> => {
    // Simulando delay de upload
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Mock da resposta
    const mockResponse: Content = {
      id: contentData.id,
      title: contentData.title || "Título atualizado",
      description: contentData.description || "Descrição atualizada",
      subtitle: "",
      subcontent: "",
      createdAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hora atrás
      updatedAt: new Date(),
      coverUrl: contentData.images?.[0] ? URL.createObjectURL(contentData.images[0]) : "",
      images: contentData.images?.map(img => URL.createObjectURL(img)) || [],
      videos: contentData.video ? [URL.createObjectURL(contentData.video)] : [],
      category: contentData.categories?.[0] || "1",
      isFavorite: false,
      authorId: "current_user",
      tags: [],
      comments: []
    };

    // Implementação real (comentada por enquanto)
    /*
    const formData = new FormData();
    
    if (contentData.title) formData.append('title', contentData.title);
    if (contentData.description) formData.append('description', contentData.description);
    if (contentData.categories) formData.append('categories', JSON.stringify(contentData.categories));

    if (contentData.images) {
      contentData.images.forEach((image, index) => {
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
    */

    return mockResponse;
  },

  deleteContent: async (contentId: string): Promise<void> => {
    // Simulando delay da API
    await new Promise(resolve => setTimeout(resolve, 500));

    // Mock - em produção substituir pela chamada real
    console.log(`Mock: Deletando conteúdo ${contentId}`);

    // Implementação real (comentada por enquanto)
    // await api.delete(`/contents/${contentId}`);
  }
};

export default contentServices;