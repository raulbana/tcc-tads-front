"use client";
import { useState, useMemo } from "react";
import { Content, ContentCategory, ContentSimpleDTO } from "@/app/types/content";
import useContentQueries from "./services/contentQueryFactory";
import { useAuth } from "@/app/contexts/AuthContext";

const useContents = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | null>(null);
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const contentQueries = useContentQueries(['content']);

  const {
    data: categories = [],
    isLoading: isLoadingCategories,
  } = contentQueries.useGetCategories();

  const {
    data: contentsList = [],
    isLoading: isLoadingContents,
    refetch: refetchContents,
  } = contentQueries.useGetList(user?.id.toString() || '', false);

  const filteredContents = useMemo(() => {
    if (!selectedCategory) return contentsList;
    return contentsList.filter(content =>
      content.category === selectedCategory.name
    );
  }, [selectedCategory, contentsList]);

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
    setSelectedCategory(categoryId ? categories.find(cat => cat.id.toString() === categoryId) || null : null);
  };

  const handleContentClick = async (content: ContentSimpleDTO) => {
    if (!user) return;
    
    try {
      const fullContent = await contentQueries.useGetById(
        content.id.toString(),
        user.id.toString()
      ).queryFn();
      setSelectedContent(fullContent);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching content details:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContent(null);
  };

  const refreshContents = () => {
    refetchContents();
  };

  return {
    categories,
    selectedCategory,
    contentSections,
    selectedContent,
    isModalOpen,
    isLoading: isLoadingCategories || isLoadingContents,
    handleCategorySelect,
    handleContentClick,
    handleCloseModal,
    refreshContents,
  };
};

export default useContents;