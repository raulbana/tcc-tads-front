"use client";
import { useState, useMemo } from "react";
import { Content, ContentSimpleDTO } from "@/app/types/content";
import useContentQueries from "./services/contentQueryFactory";
import { useAuth } from "@/app/contexts/AuthContext";
import contentServices from "./services/contentServices";

const useContents = () => {
  const { user } = useAuth();
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    new Set()
  );
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const contentQueries = useContentQueries(["content"]);

  const { data: categories = [], isLoading: isLoadingCategories } =
    contentQueries.useGetCategories();

  const {
    data: contentsList = [],
    isLoading: isLoadingContents,
    refetch: refetchContents,
  } = contentQueries.useGetList(user?.id.toString() || "", false);

  const filteredContents = useMemo(() => {
    if (selectedCategories.size === 0) return contentsList;

    const selectedCategoryNames = new Set(
      categories
        .filter((cat) => selectedCategories.has(cat.id.toString()))
        .map((cat) => cat.name)
    );

    return contentsList.filter((content) =>
      content.categories?.some((categoryName) =>
        selectedCategoryNames.has(categoryName)
      )
    );
  }, [selectedCategories, contentsList, categories]);

  const contentSections = useMemo(() => {
    const sectionMap = new Map<string, Map<number, ContentSimpleDTO>>();

    filteredContents.forEach((content) => {
      if (content.section && content.section.length > 0) {
        content.section.forEach((sectionName) => {
          if (!sectionMap.has(sectionName)) {
            sectionMap.set(sectionName, new Map());
          }
          const sectionContents = sectionMap.get(sectionName)!;
          if (!sectionContents.has(content.id)) {
            sectionContents.set(content.id, content);
          }
        });
      }
    });

    const sections = Array.from(sectionMap.entries()).map(
      ([title, contentsMap]) => ({
        title,
        contents: Array.from(contentsMap.values()),
      })
    );

    return sections.filter((section) => section.contents.length > 0);
  }, [filteredContents]);

  const handleCategorySelect = (categoryId: string | null) => {
    if (categoryId === null) {
      setSelectedCategories(new Set());
    } else {
      setSelectedCategories((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(categoryId)) {
          newSet.delete(categoryId);
        } else {
          newSet.add(categoryId);
        }
        return newSet;
      });
    }
  };

  const handleContentClick = async (content: ContentSimpleDTO) => {
    if (!user) return;

    try {
      const fullContent = await contentServices.getById(
        content.id.toString(),
        user.id.toString()
      );
      setSelectedContent(fullContent);
      setIsModalOpen(true);
    } catch (error) {
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedContent(null);
  };

  const refreshContents = () => {
    refetchContents();
  };

  const hasActiveFilters = selectedCategories.size > 0;

  return {
    categories,
    selectedCategories,
    filteredContents,
    contentSections,
    selectedContent,
    isModalOpen,
    hasActiveFilters,
    isLoading: isLoadingCategories || isLoadingContents,
    handleCategorySelect,
    handleContentClick,
    handleCloseModal,
    refreshContents,
  };
};

export default useContents;
