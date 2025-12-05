import {
  QueryKey,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  ContactRequest,
  ContactResponse,
  AccessibilityPreferences,
  EditProfileRequest,
  EditProfileResponse,
} from "@/app/types/config";
import configServices from "./configServices";

export const configQueryFactory = (baseKey: QueryKey) => {
  const queryClient = useQueryClient();

  return {
    useGetAccessibilityPreferences: (userId: string) =>
      useQuery<AccessibilityPreferences>({
        queryKey: [...baseKey, "accessibility-preferences", userId],
        queryFn: () => configServices.getAccessibilityPreferences(userId),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!userId,
      }),

    useUpdateAccessibilityPreferences: () =>
      useMutation<
        AccessibilityPreferences,
        Error,
        { userId: string; preferences: AccessibilityPreferences }
      >({
        mutationFn: ({ userId, preferences }) =>
          configServices.updateAccessibilityPreferences(userId, preferences),
      }),

    useSendContactEmail: () =>
      useMutation<ContactResponse, Error, ContactRequest>({
        mutationFn: (data: ContactRequest) =>
          configServices.sendContactEmail(data),
      }),

    useEditProfile: () =>
      useMutation<
        EditProfileResponse,
        Error,
        {
          userId: number;
          data: EditProfileRequest;
          profilePictureFile?: File | string;
        }
      >({
        mutationFn: ({ userId, data, profilePictureFile }) =>
          configServices.editProfile(userId, data, profilePictureFile),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["auth", "user"],
          });
          queryClient.invalidateQueries({
            queryKey: ["profile", "user"],
          });
        },
      }),
  };
};

const useConfigQueries = (queryKey: QueryKey) => {
  const queries = configQueryFactory(queryKey);
  return {
    ...queries,
  };
};

export default useConfigQueries;
