"use client";
import { useState, useMemo } from "react";
import { Content, ContentCategory } from "@/app/types/content";

const mockCategories: ContentCategory[] = [
  { id: "1", name: "Alimentação e Nutrição", auditable: false},
  { id: "2", name: "Hábitos Saudáveis", auditable: false},
  { id: "3", name: "Dicas de Fisioterapia Pélvica", auditable: true},
  { id: "4", name: "Depoimentos e Histórias Reais", auditable: false},
  { id: "5", name: "Mitos e Verdades", auditable: true},
];

const mockContents: Content[] = [
  {
    id: "1",
    title: "Título legal do conteudo que é bem cumprido e interessante com um titulo bem grande e mucho longo",
    subtitle: "Lorem ipsum fdgorj rgogijr groigjrgo grtoigj groigjtr grtigjorg gojirt dolor sit amet consectetur. Ac nunc lacus",
    description: "Lorem ipsum dolor sit amet consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    subcontent: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium.",
    createdAt: new Date(),
    updatedAt: new Date(),
    coverUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"
    ],
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    category: [mockCategories[0], mockCategories[2], mockCategories[3]],
    authorId: "id12",
    commentsCount: 2,
    comments: [
      {
        id: "1",
        contentId: "1",
        authorId: "user1",
        text: "Muito interessante este conteúdo! Obrigada por compartilhar.",
        authorName: "Maria Silva",
        authorImage: "https://ui-avatars.com/api/?name=MS&background=5F3C6F&color=F5E5FD",
        createdAt: new Date(Date.now() - 1000 * 60 * 30), // 30 min atrás
        updatedAt: new Date(Date.now() - 1000 * 60 * 30),
        likesCount: 3,
        isLikedByCurrentUser: false,
        repliesCount: 3,
        replies: [
          {
            id: "1-1",
            contentId: "1",
            authorId: "user3",
            text: "Concordo totalmente! Muito útil mesmo.",
            authorName: "João Santos",
            authorImage: "https://ui-avatars.com/api/?name=JS&background=AC85BE&color=F5E5FD",
            createdAt: new Date(Date.now() - 1000 * 60 * 25),
            updatedAt: new Date(Date.now() - 1000 * 60 * 25),
            likesCount: 1,
            isLikedByCurrentUser: true,
            repliesCount: 0,
            replies: []
          },
          {
            id: "1-2",
            contentId: "1",
            authorId: "user4",
            text: "Estava precisando exatamente dessas informações!",
            authorName: "Ana Costa",
            authorImage: "https://ui-avatars.com/api/?name=AC&background=AC85BE&color=F5E5FD",
            createdAt: new Date(Date.now() - 1000 * 60 * 20),
            updatedAt: new Date(Date.now() - 1000 * 60 * 20),
            likesCount: 2,
            isLikedByCurrentUser: false,
            repliesCount: 0,
            replies: []
          },
          {
            id: "1-3",
            contentId: "1",
            authorId: "user5",
            text: "Vou compartilhar com meus amigos também!",
            authorName: "Pedro Lima",
            authorImage: "https://ui-avatars.com/api/?name=PL&background=5F3C6F&color=F5E5FD",
            createdAt: new Date(Date.now() - 1000 * 60 * 10),
            updatedAt: new Date(Date.now() - 1000 * 60 * 10),
            likesCount: 0,
            isLikedByCurrentUser: false,
            repliesCount: 0,
            replies: []
          }
        ]
      },
      {
        id: "2",
        contentId: "1",
        authorId: "user2",
        text: "Concordo completamente! Esse tipo de informação é muito valiosa.",
        authorName: "Ana Costa",
        authorImage: "https://ui-avatars.com/api/?name=Ana+Costa&background=AC85BE&color=F5E5FD",
        createdAt: new Date(Date.now() - 1000 * 60 * 15), // 15 min atrás
        updatedAt: new Date(Date.now() - 1000 * 60 * 15),
        likesCount: 1,
        isLikedByCurrentUser: true,
        repliesCount: 0,
        replies: []
      }
    ]
  },
  {
    id: "2",
    title: "Título legal",
    subtitle: "Lorem ipsum dolor sit amet consectetur. Ac",
    description: "Descrição do conteúdo",
    createdAt: new Date(),
    updatedAt: new Date(),
    coverUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    images: [],
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    category: [mockCategories[0], mockCategories[1]],
    authorId: "author1",
    comments: [],
    commentsCount: 0,
  },
  {
    id: "3",
    title: "Título legal",
    subtitle: "Lorem ipsum dolor sit amet consectetur. Ac nunc lacus",
    description: "Descrição do conteúdo",
    createdAt: new Date(),
    updatedAt: new Date(),
    coverUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    images: [],
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    category: [mockCategories[0], mockCategories[1]],
    authorId: "author1",
    comments: [],
    commentsCount: 0,
  },
  {
    id: "4",
    title: "Título legal",
    subtitle: "Lorem ipsum dolor sit amet consectetur. Ac",
    description: "Descrição do conteúdo",
    createdAt: new Date(),
    updatedAt: new Date(),
    coverUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    images: [],
    video: 'https://www.w3schools.com/html/mov_bbb.mp4',
    category: [mockCategories[0], mockCategories[1]],
    authorId: "author1",
    comments: [],
    commentsCount: 0,
  },
  {
    id: "5",
    title: "Título legal",
    subtitle: "Lorem ipsum dolor sit amet consectetur. Ac nunc lacus",
    description: "Descrição do conteúdo",
    createdAt: new Date(),
    updatedAt: new Date(),
    coverUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    images: [],
    category: [mockCategories[0], mockCategories[1]],
    authorId: "author1",
    comments: [],
    commentsCount: 0,
  },
  {
    id: "6",
    title: "Título legal",
    subtitle: "Lorem ipsum dolor sit amet consectetur. Ac",
    description: "Descrição do conteúdo",
    createdAt: new Date(),
    updatedAt: new Date(),
    coverUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    images: [],
    category: [mockCategories[0], mockCategories[1]],
    authorId: "author1",
    comments: [],
    commentsCount: 0,
  },
];

const useContents = () => {
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | null>(null);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredContents = useMemo(() => {
    if (!selectedCategory) return mockContents;
    return mockContents.filter(content =>
      content.category.some(cat => cat.id === selectedCategory.id)
    );
  }, [selectedCategory]);

  const contentSections = useMemo(() => {
    const sections = [
      { title: "Conteúdo X", contents: filteredContents.slice(0, 4) },
      { title: "Conteúdo Y", contents: filteredContents.slice(2, 6) },
      { title: "Conteúdo W", contents: filteredContents.slice(1, 5) },
      { title: "Conteúdo Z", contents: filteredContents.slice(3, 7) },
    ];
    
    return sections.filter(section => section.contents.length > 0);
  }, [filteredContents]);

  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId ? mockCategories.find(cat => cat.id === categoryId) || null : null);
  };

  const handleContentClick = (content: Content) => {
    setSelectedContent(content);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContent(null);
  };

  return {
    categories: mockCategories,
    selectedCategory,
    contentSections,
    selectedContent,
    isModalOpen,
    handleCategorySelect,
    handleContentClick,
    handleCloseModal,
  };
};

export default useContents;