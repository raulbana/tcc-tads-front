import {
  QueryKey,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import contentServices from "@/app/contents/services/contentServices";
import { Content } from "@/app/types/content";
import configServices from "@/app/services/configServices";
import { UserSimpleDTO } from "@/app/types/config";

export const profileQueryFactory = (baseKey: QueryKey) => {
  const queryClient = useQueryClient();

  return {
    useGetUserById: (userId: number) =>
      useQuery<UserSimpleDTO>({
        queryKey: [...baseKey, "user", userId],
        queryFn: () => configServices.getUserById(userId),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!userId,
      }),

    useGetUserContent: (userId: string) =>
      useQuery<Content[]>({
        queryKey: [...baseKey, "user-content", userId],
        queryFn: () => contentServices.getUserContent(userId),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!userId,
      }),

    useGetSavedContent: (userId?: string) =>
      useQuery<Content[]>({
        queryKey: [...baseKey, "saved-content", userId],
        queryFn: () => contentServices.getSavedContent(),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!userId,
      }),

    useDeleteContent: () =>
      useMutation<void, Error, string>({
        mutationFn: (contentId: string) =>
          contentServices.deleteContent(contentId),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [...baseKey, "user-content"],
          });
          queryClient.invalidateQueries({
            queryKey: [...baseKey, "user"],
          });
        },
      }),

    useUnsaveContent: () =>
      useMutation<void, Error, string>({
        mutationFn: (contentId: string) =>
          contentServices.unsaveContent(contentId),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [...baseKey, "saved-content"],
          });
          queryClient.invalidateQueries({
            queryKey: [...baseKey, "user"],
          });
        },
      }),
  };
};

const useProfileQueries = (queryKey: QueryKey) => {
  const queries = profileQueryFactory(queryKey);
  return {
    ...queries,
  };
};

export default useProfileQueries;
