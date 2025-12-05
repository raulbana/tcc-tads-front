"use client";

import React from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute/ProtectedRoute";
import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import ContentTabs from "./components/ContentTabs/ContentTabs";
import ContentList from "./components/ContentList/ContentList";
import ProfileForm from "./components/ProfileForm/ProfileForm";
import ProfilePictureSection from "./components/ProfilePictureSection/ProfilePictureSection";
import Toast from "@/app/components/Toast/Toast";
import ContentModal from "@/app/contents/components/ContentModal/ContentModal";
import useProfile from "./useProfile";

const ProfilePage = () => {
  const {
    user,
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
    handleSaveProfile,
    handleProfilePictureChange,
    handleRemoveProfilePicture,
    handleDeletePost,
    handleUnsaveContent,
    handleContentClick,
    handleTabChange,
    handleEditContent,
    handleCloseEditModal,
    handleEditContentSuccess,
    isEditModalOpen,
    selectedContentForEdit,
    editContentId,
    DialogPortal,
    stats,
    currentProfilePictureUrl,
  } = useProfile();

  if (!user) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8 lg:px-12">
          {!isEditing ? (
            <>
              <ProfileHeader
                user={user}
                onEditProfile={handleEditProfile}
                isEditing={false}
                stats={stats}
              />

              <div className="mt-8 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <ContentTabs
                  activeTab={activeTab}
                  onTabChange={handleTabChange}
                />

                <div className="mt-6">
                  {activeTab === "saved" ? (
                    <ContentList
                      contents={savedContent}
                      isLoading={isLoading}
                      onContentClick={handleContentClick}
                      onUnsaveContent={handleUnsaveContent}
                      showActions={true}
                      emptyMessage="Nenhum conteúdo salvo encontrado"
                    />
                  ) : (
                    <ContentList
                      contents={posts}
                      isLoading={isLoading}
                      onContentClick={handleContentClick}
                      onEditContent={handleEditContent}
                      onDeleteContent={handleDeletePost}
                      showActions={true}
                      emptyMessage="Nenhuma postagem encontrada"
                    />
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">
                  Editar Perfil
                </h1>
                <button
                  onClick={handleCancelEdit}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="flex justify-center">
                <ProfilePictureSection
                  currentPicture={currentProfilePictureUrl}
                  onPictureChange={handleProfilePictureChange}
                  onRemovePicture={handleRemoveProfilePicture}
                />
              </div>

              <ProfileForm
                errors={errors}
                isValid={isValid}
                register={register}
                control={control}
                isSaving={isSaving}
                onSave={handleSaveProfile}
                onCancel={handleCancelEdit}
              />
            </div>
          )}

          <Toast
            type={toast.type}
            message={toast.message}
            isOpen={toast.isOpen}
            onClose={closeToast}
          />
          {DialogPortal}

          <ContentModal
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            onSuccess={handleEditContentSuccess}
            initialData={selectedContentForEdit || undefined}
            mode="edit"
            contentId={editContentId || undefined}
          />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;
