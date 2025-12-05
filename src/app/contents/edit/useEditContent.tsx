"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { Content } from "@/app/types/content";
import useContentQueries from "../services/contentQueryFactory";

interface UseEditContentProps {
  contentId?: string;
}

const useEditContent = ({ contentId }: UseEditContentProps = {}) => {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  const contentQueries = useContentQueries(["content"]);

  const {
    data: contentData,
    isLoading: isLoadingById,
    error: errorById,
  } = contentQueries.useGetById(
    contentId || "",
    user?.id.toString() || ""
  );

  const {
    data: contentsList = [],
    isLoading: isLoadingList,
    error: errorList,
  } = contentQueries.useGetList(user?.id.toString() || "", false);

  const isLoading = isLoadingById || isLoadingList;
  const error = errorById || errorList;

  useEffect(() => {
    if (contentData && contentId) {
      setSelectedContent(contentData);
    }
  }, [contentData, contentId]);

  const handleSelectContent = useCallback(
    (content: Content) => {
      router.push(`/contents/edit/${content.id}`);
    },
    [router]
  );

  const goBack = useCallback(() => {
    router.back();
  }, [router]);

  return {
    content: selectedContent,
    contentsList: contentsList as unknown as Content[],
    isLoading,
    error,
    handleSelectContent,
    goBack,
    hasContentId: !!contentId,
  };
};

export default useEditContent;






