"use client";

import { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { Content } from "@/app/types/content";
import { ContentTab } from "./components/ContentTabs/ContentTabs";
import useProfileQueries from "./services/profileQueryFactory";
import useConfigQueries from "@/app/services/configQueryFactory";
import useContentQueries from "@/app/contents/services/contentQueryFactory";
import { profileFormSchema, ProfileFormData } from "./schema/profileSchema";
import { User } from "@/app/types/auth";
import { ToastType } from "@/app/components/Toast/Toast";
import useDialogModal from "@/app/components/DialogModal/useDialogModal";

const useProfile = () => {
  const { user, updateUser } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ContentTab>("own");
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState<{
    isOpen: boolean;
    message: string;
    type: ToastType;
  }>({
    isOpen: false,
    message: "",
    type: "INFO",
  });
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  );
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedContentForEdit, setSelectedContentForEdit] =
    useState<Content | null>(null);
  const [editContentId, setEditContentId] = useState<string | null>(null);

  const { showDialog, DialogPortal: ProfileDialogPortal } = useDialogModal();

  const profileQueries = useProfileQueries(["profile"]);
  const configQueries = useConfigQueries(["config"]);
  const contentQueries = useContentQueries(["content"]);

  const {
    data: userData,
    isLoading: isLoadingUserData,
    refetch: refetchUserData,
  } = profileQueries.useGetUserById(user?.id || 0);

  const {
    data: allPosts = [],
    isLoading: isLoadingPosts,
    refetch: refetchPosts,
  } = profileQueries.useGetUserContent(user?.id.toString() || "");

  // Filtrar apenas conteúdos do usuário logado para garantir que não venham conteúdos de outros usuários
  const posts = allPosts.filter((post) => {
    if (!user?.id || !post.author) return false;
    return post.author.id === user.id || Number(post.author.id) === user.id;
  });

  const {
    data: savedContent = [],
    isLoading: isLoadingSaved,
    refetch: refetchSaved,
  } = profileQueries.useGetSavedContent(user?.id.toString());

  const { data: fullContentData, isLoading: isLoadingContent } =
    contentQueries.useGetById(editContentId || "", user?.id.toString() || "");

  const deleteContentMutation = profileQueries.useDeleteContent();
  const unsaveContentMutation = profileQueries.useUnsaveContent();
  const editProfileMutation = configQueries.useEditProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    reset,
    control,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
      gender: undefined,
      profilePictureUrl: "",
    },
    mode: "onBlur",
    criteriaMode: "all",
  });

  const watchedProfilePictureUrl = watch("profilePictureUrl");

  useEffect(() => {
    if (user && isEditing) {
      const validGenders: Array<"male" | "female"> = [
        "male",
        "female",
      ];
      const userGender = user.profile?.gender;
      // Normalizar o gênero para lowercase para garantir compatibilidade
      const normalizedGender = userGender?.toLowerCase() as
        | "male"
        | "female"
        | "other"
        | undefined;
      const gender =
        normalizedGender && validGenders.includes(normalizedGender)
          ? normalizedGender
          : undefined;

      reset(
        {
          name: user.name,
          email: user.email,
          gender: gender,
          profilePictureUrl: user.profilePictureUrl || "",
        },
        { keepDefaultValues: false, shouldValidate: true }
      );
    }
  }, [user, isEditing, reset]);

  useEffect(() => {
    if (fullContentData && editContentId) {
      setSelectedContentForEdit(fullContentData);
    }
  }, [fullContentData, editContentId]);

  const showToast = (message: string, type: ToastType = "SUCCESS") => {
    setToast({
      isOpen: true,
      message,
      type,
    });
  };

  const closeToast = () => {
    setToast((prev) => ({ ...prev, isOpen: false }));
  };

  const handleEditProfile = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setIsEditing(false);
    setProfilePictureFile(null);
    if (user) {
      const validGenders: Array<"male" | "female"> = [
        "male",
        "female",
      ];
      const userGender = user.profile?.gender;
      // Normalizar o gênero para lowercase para garantir compatibilidade
      const normalizedGender = userGender?.toLowerCase() as
        | "male"
        | "female"
        | "other"
        | undefined;
      const gender =
        normalizedGender && validGenders.includes(normalizedGender)
          ? normalizedGender
          : undefined;

      reset(
        {
          name: user.name,
          email: user.email,
          gender: gender,
          profilePictureUrl: user.profilePictureUrl || "",
        },
        { keepDefaultValues: false, shouldValidate: true }
      );
    }
  }, [user, reset]);

  const handleProfilePictureChange = useCallback(
    (file: File) => {
      setProfilePictureFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setValue("profilePictureUrl", reader.result as string, {
          shouldValidate: true,
        });
      };
      reader.readAsDataURL(file);
    },
    [setValue]
  );

  const handleRemoveProfilePicture = useCallback(() => {
    setProfilePictureFile(null);
    setValue("profilePictureUrl", "", { shouldValidate: true });
  }, [setValue]);

  const handleSaveProfile = async (data: ProfileFormData) => {
    if (!user) {
      return;
    }

    try {
      const originalPictureUrl = user.profilePictureUrl || "";
      const newPictureUrl = data.profilePictureUrl || "";

      // Foto foi alterada apenas se:
      // 1. Há um arquivo selecionado (profilePictureFile existe), OU
      // 2. A URL mudou E a nova URL é uma data URL (preview de nova foto)
      const hasNewFile = !!profilePictureFile;
      const isDataUrl = newPictureUrl.startsWith("data:");
      const urlChanged = newPictureUrl !== originalPictureUrl;
      const isPictureChanged = hasNewFile || (urlChanged && isDataUrl);

      const response = await editProfileMutation.mutateAsync({
        userId: user.id,
        data: {
          name: data.name.trim(),
          email: user.email, // Email deve ser enviado mesmo que não seja alterado
        },
        profilePictureFile:
          isPictureChanged && profilePictureFile
            ? profilePictureFile
            : undefined,
      });

      const updatedUser: User = {
        ...user,
        name: response.name,
        email: response.email,
        profilePictureUrl: response.profilePictureUrl,
        profile: {
          ...response.profile,
          gender: response.profile.gender as User["profile"]["gender"],
          iciqScore: response.profile.iciqScore as User["profile"]["iciqScore"],
        },
        preferences: {
          ...response.preferences,
          workoutMediaType: response.preferences
            .workoutMediaType as User["preferences"]["workoutMediaType"],
        },
      };

      await updateUser(updatedUser);
      setIsEditing(false);
      setProfilePictureFile(null);
      showToast("Perfil atualizado com sucesso!");
    } catch (error) {
      showToast(
        error instanceof Error
          ? error.message
          : "Falha ao atualizar perfil. Tente novamente.",
        "ERROR"
      );
    }
  };

  const handleDeletePost = useCallback(
    async (content: Content) => {
      if (!content.id) return;

      showDialog({
        title: "Excluir Postagem",
        description: `Tem certeza que deseja excluir a postagem "${content.title}"? Esta ação não pode ser desfeita.`,
        secondaryButton: {
          label: "Cancelar",
          onPress: () => {},
        },
        primaryButton: {
          label: "Excluir",
          onPress: async () => {
            try {
              await deleteContentMutation.mutateAsync(content.id.toString());
              showToast("Postagem excluída com sucesso!");
              refetchPosts();
            } catch (error) {
              showToast("Não foi possível excluir a postagem.", "ERROR");
            }
          },
          type: "PRIMARY",
          autoClose: true,
        },
        dismissOnBackdropPress: false,
      });
    },
    [deleteContentMutation, refetchPosts, showDialog]
  );

  const handleUnsaveContent = useCallback(
    async (content: Content) => {
      if (!content.id) return;

      showDialog({
        title: "Remover dos Salvos",
        description: "Tem certeza que deseja remover este conteúdo dos salvos?",
        secondaryButton: {
          label: "Cancelar",
          onPress: () => {},
        },
        primaryButton: {
          label: "Remover",
          onPress: async () => {
            try {
              await unsaveContentMutation.mutateAsync(content.id.toString());
              showToast("Conteúdo removido dos salvos!");
              refetchSaved();
            } catch (error) {
              showToast("Não foi possível remover o conteúdo.", "ERROR");
            }
          },
          type: "PRIMARY",
          autoClose: true,
        },
        dismissOnBackdropPress: false,
      });
    },
    [unsaveContentMutation, refetchSaved, showDialog]
  );

  const handleContentClick = useCallback(
    (content: Content) => {
      if (content.id) {
        router.push(`/contents?id=${content.id}`);
      }
    },
    [router]
  );

  const handleTabChange = useCallback((tab: ContentTab) => {
    setActiveTab(tab);
  }, []);

  const handleEditContent = useCallback((content: Content) => {
    if (content.id) {
      const contentId = content.id.toString();
      setEditContentId(contentId);
      setIsEditModalOpen(true);
      if (content.title && content.description) {
        setSelectedContentForEdit(content);
      }
    }
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setEditContentId(null);
    setSelectedContentForEdit(null);
  }, []);

  const handleEditContentSuccess = useCallback(
    (contentId: string) => {
      handleCloseEditModal();
      refetchPosts();
      showToast("Conteúdo atualizado com sucesso!");
    },
    [handleCloseEditModal, refetchPosts, showToast]
  );

  const isLoading =
    isLoadingUserData ||
    isLoadingPosts ||
    isLoadingSaved ||
    isLoadingContent ||
    deleteContentMutation.isPending ||
    unsaveContentMutation.isPending;

  const isSaving = editProfileMutation.isPending;

  // Usar dados do endpoint se disponíveis, caso contrário usar dados do AuthContext ou calcular
  const displayUser = userData
    ? {
        ...user,
        profilePictureUrl:
          userData.profilePictureUrl || user?.profilePictureUrl,
        curtidas: userData.curtidas,
        salvos: userData.salvos,
        postagens: userData.postagens,
      }
    : user;

  // Estatísticas: usar dados do endpoint se disponíveis, caso contrário calcular
  const stats = userData
    ? {
        likes: userData.curtidas || 0,
        posts: userData.postagens || 0,
        saved: userData.salvos || 0,
      }
    : {
        likes: posts.reduce((sum, post) => sum + (post.likesCount || 0), 0),
        posts: posts.length,
        saved: savedContent.length,
      };

  // Atualizar user quando os dados do endpoint forem carregados
  useEffect(() => {
    if (userData && user) {
      const updatedUser: User = {
        ...user,
        profilePictureUrl: userData.profilePictureUrl || user.profilePictureUrl,
        curtidas: userData.curtidas,
        salvos: userData.salvos,
        postagens: userData.postagens,
      };
      // Só atualiza se houver diferença para evitar loops
      if (
        updatedUser.profilePictureUrl !== user.profilePictureUrl ||
        updatedUser.curtidas !== user.curtidas ||
        updatedUser.salvos !== user.salvos ||
        updatedUser.postagens !== user.postagens
      ) {
        updateUser(updatedUser);
      }
    }
  }, [userData, user, updateUser]);

  const handleRefresh = useCallback(() => {
    if (activeTab === "saved") {
      refetchSaved();
    } else {
      refetchPosts();
    }
    refetchUserData();
  }, [activeTab, refetchSaved, refetchPosts, refetchUserData]);

  return {
    user: displayUser,
    posts,
    savedContent,
    activeTab,
    isEditing,
    isLoading,
    isSaving,
    errors,
    isValid,
    register,
    control,
    toast,
    closeToast,
    handleEditProfile,
    handleCancelEdit,
    handleSaveProfile: handleSubmit(handleSaveProfile),
    handleProfilePictureChange,
    handleRemoveProfilePicture,
    handleDeletePost,
    handleUnsaveContent,
    handleContentClick,
    handleTabChange,
    handleRefresh,
    handleEditContent,
    handleCloseEditModal,
    handleEditContentSuccess,
    isEditModalOpen,
    selectedContentForEdit,
    editContentId,
    DialogPortal: ProfileDialogPortal,
    stats,
    currentProfilePictureUrl:
      watchedProfilePictureUrl || user?.profilePictureUrl || "",
  };
};

export default useProfile;
