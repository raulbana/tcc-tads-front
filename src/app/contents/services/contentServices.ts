//import { apiFactory } from "@/app/services/apiFactory";
//import { API_BASE_URL } from "@/app/config/env";
import { Content, ContentCategory } from "@/app/types/content";

//const api = apiFactory(API_BASE_URL);

export interface CreateContentRequest {
  title: string;
  description: string;
  subtitle?: string;
  subcontent?: string;
  images: File[];
  video?: File;
  categories: string[];
}

export interface UpdateContentRequest extends Partial<CreateContentRequest> {
  id: string;
}

// Mock data para desenvolvimento
const mockCategories: ContentCategory[] = [
  { id: "1", name: "Alimentação e Nutrição", auditable: false},
  { id: "2", name: "Hábitos Saudáveis", auditable: false},
  { id: "3", name: "Dicas de Fisioterapia Pélvica", auditable: true},
  { id: "4", name: "Depoimentos e Histórias Reais", auditable: false},
  { id: "5", name: "Mitos e Verdades", auditable: true},
];

const contentServices = {
  getById: async (contentId: string): Promise<Content> => {
    // Simulando delay da API
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock data - em produção substituir pela chamada real
    const mockContent: Content = {
      id: contentId,
      title: "Título do conteúdo",
      description: "Descrição do conteúdo",
      subtitle: "Subtítulo do conteúdo",
      subcontent: "Conteúdo adicional do post",
      createdAt: new Date(),
      updatedAt: new Date(),
      coverUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"
      ],
      videos: [],
      category: mockCategories.slice(0, 2),
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
        subcontent: "Neste artigo, vamos explorar os principais alimentos que podem fortalecer a musculatura pélvica e melhorar sua qualidade de vida.",
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
        subcontent: "Este guia completo vai te ensinar passo a passo como realizar os exercícios corretamente e obter os melhores resultados.",
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
        subcontent: "Esta é uma história real de superação que pode inspirar outras pessoas que passam pelas mesmas dificuldades.",
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
      subtitle: contentData.subtitle || "",
      subcontent: contentData.subcontent || "",
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
    if (contentData.subtitle) formData.append('subtitle', contentData.subtitle);
    if (contentData.subcontent) formData.append('subcontent', contentData.subcontent);
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
      subtitle: contentData.subtitle || "",
      subcontent: contentData.subcontent || "",
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
    if (contentData.subtitle) formData.append('subtitle', contentData.subtitle);
    if (contentData.subcontent) formData.append('subcontent', contentData.subcontent);
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
    // await api.delete(`/contents/${contentId}`);
    
    console.log(`Content ${contentId} deleted`);
  },
};

export default contentServices;