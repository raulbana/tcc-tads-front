import apiFactory from "./apiFactory";
import { API_BASE_URL } from "@/app/config/env";
import apiRoutes from "@/app/utils/apiRoutes";
import { ContactRequest, ContactResponse, AccessibilityPreferences } from "@/app/types/config";

const api = apiFactory(API_BASE_URL ?? "");

export const configServices = {
  sendContactEmail: async (data: ContactRequest): Promise<ContactResponse> => {
    const response = await api.post(apiRoutes.contact, data);
    return response.data;
  },

  getAccessibilityPreferences: async (userId: string): Promise<AccessibilityPreferences> => {
    const response = await api.get(apiRoutes.accessibility.get, {
      headers: {
        'x-user-id': userId,
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
          'x-user-id': userId,
        },
      }
    );
    return response.data;
  },
};

export default configServices;