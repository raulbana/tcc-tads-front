import { QueryKey, useQuery, useMutation } from '@tanstack/react-query';
import { ContactRequest, ContactResponse, AccessibilityPreferences } from '@/app/types/config';
import configServices from './configServices';

export const configQueryFactory = (baseKey: QueryKey) => {
  return {
    useGetAccessibilityPreferences: (userId: string) =>
      useQuery<AccessibilityPreferences>({
        queryKey: [...baseKey, 'accessibility-preferences', userId],
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
  };
};

const useConfigQueries = (queryKey: QueryKey) => {
  const queries = configQueryFactory(queryKey);
  return {
    ...queries,
  };
};

export default useConfigQueries;