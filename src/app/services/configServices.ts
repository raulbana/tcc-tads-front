import apiFactory from "./apiFactory";
import { API_BASE_URL } from "@/app/config/env";
import apiRoutes from "@/app/utils/apiRoutes";
import {
  ContactRequest,
  ContactResponse,
  AccessibilityPreferences,
  EditProfileRequest,
  EditProfileResponse,
  UserSimpleDTO,
} from "@/app/types/config";
import contentServices from "@/app/contents/services/contentServices";

const api = apiFactory(API_BASE_URL ?? "");

export const configServices = {
  sendContactEmail: async (data: ContactRequest): Promise<ContactResponse> => {
    const response = await api.post(apiRoutes.contact, data);
    return response.data;
  },

  getAccessibilityPreferences: async (
    userId: string
  ): Promise<AccessibilityPreferences> => {
    const response = await api.get(apiRoutes.accessibility.get, {
      headers: {
        "x-user-id": userId,
      },
    });
    return response.data;
  },

  updateAccessibilityPreferences: async (
    userId: string,
    preferences: AccessibilityPreferences
  ): Promise<AccessibilityPreferences> => {
    const response = await api.patch(
      apiRoutes.accessibility.update,
      preferences,
      {
        headers: {
          "x-user-id": userId,
        },
      }
    );
    return response.data;
  },

  editProfile: async (
    userId: number,
    data: EditProfileRequest,
    profilePictureFile?: File | string
  ): Promise<EditProfileResponse> => {
    let profilePicture: EditProfileRequest["profilePicture"] = undefined;

    // Só processar foto se houver um arquivo novo selecionado
    if (profilePictureFile) {
      try {
        const formData = new FormData();

        if (profilePictureFile instanceof File) {
          formData.append("files", profilePictureFile);
        } else if (
          typeof profilePictureFile === "string" &&
          !profilePictureFile.startsWith("http")
        ) {
          const response = await fetch(profilePictureFile);
          const blob = await response.blob();
          const file = new File([blob], "profile-picture.jpg", {
            type: blob.type || "image/jpeg",
          });
          formData.append("files", file);
        }

        const uploadRes = await contentServices.uploadMedia(formData);
        const uploadedMedia = Array.isArray(uploadRes?.media)
          ? uploadRes.media[0]
          : Array.isArray(uploadRes)
          ? uploadRes[0]
          : uploadRes;

        if (uploadedMedia) {
          profilePicture = {
            url: uploadedMedia.url,
            contentType: uploadedMedia.contentType || "image/jpeg",
            contentSize: uploadedMedia.contentSize || 0,
            altText: uploadedMedia.altText || "Profile picture",
          };
        }
      } catch (error) {
        throw new Error("Falha ao fazer upload da imagem de perfil");
      }
    }

    // Se não há profilePicture, não incluir no request (backend manterá a foto atual)
    const requestData: EditProfileRequest = {
      name: data.name,
      email: data.email,
      ...(profilePicture && { profilePicture }),
    };

    const response = await api.put(apiRoutes.profile.edit(userId), requestData);
    return response.data;
  },

  getUserById: async (userId: number): Promise<UserSimpleDTO> => {
    const response = await api.get(apiRoutes.profile.getById(userId));
    return response.data;
  },
};

export default configServices;
