"use client";
import { useState, useMemo } from "react";
import { Content, ContentCategory } from "@/app/types/content";

const mockCategories: ContentCategory[] = [
  { id: "1", name: "Ipsum", createdAt: new Date(), updatedAt: new Date() },
  { id: "2", name: "Dolor", createdAt: new Date(), updatedAt: new Date() },
  { id: "3", name: "Sit", createdAt: new Date(), updatedAt: new Date() },
  { id: "4", name: "Amet", createdAt: new Date(), updatedAt: new Date() },
  { id: "5", name: "Consectetur", createdAt: new Date(), updatedAt: new Date() },
];

const mockContents: Content[] = [
  {
    id: "1",
    title: "Título legal",
    subtitle: "Lorem ipsum dolor sit amet consectetur. Ac nunc lacus",
    description: "Descrição do conteúdo",
    createdAt: new Date(),
    updatedAt: new Date(),
    coverUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    images: [],
    videos: [],
    category: "1",
    isFavorite: false,
    authorId: "author1",
    tags: ["Comunidade"],
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
    videos: [],
    category: "2",
    isFavorite: false,
    authorId: "author1",
    tags: ["Lorem"],
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
    videos: [],
    category: "3",
    isFavorite: false,
    authorId: "author1",
    tags: ["Lorem"],
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
    videos: [],
    category: "1",
    isFavorite: false,
    authorId: "author1",
    tags: ["Lorem"],
  },
  // Add more mock contents for different sections
  {
    id: "5",
    title: "Título legal",
    subtitle: "Lorem ipsum dolor sit amet consectetur. Ac nunc lacus",
    description: "Descrição do conteúdo",
    createdAt: new Date(),
    updatedAt: new Date(),
    coverUrl: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
    images: [],
    videos: [],
    category: "2",
    isFavorite: false,
    authorId: "author1",
    tags: ["Lorem"],
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
    videos: [],
    category: "3",
    isFavorite: false,
    authorId: "author1",
    tags: ["Lorem"],
  },
];

const useContents = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredContents = useMemo(() => {
    if (!selectedCategory) return mockContents;
    return mockContents.filter(content => content.category === selectedCategory);
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
    setSelectedCategory(categoryId);
  };

  const handleContentClick = (content: Content) => {
    console.log("Content clicked:", content);
    // TODO: Navigate to content detail page
  };

  return {
    categories: mockCategories,
    selectedCategory,
    contentSections,
    handleCategorySelect,
    handleContentClick,
  };
};

export default useContents;