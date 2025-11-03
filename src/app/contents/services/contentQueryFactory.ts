import {
  QueryKey,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import contentServices from './contentServices';
import {
  Content,
  ContentCategory,
  CreateContentRequest,
  CreateContentWithFilesRequest,
  UpdateContentRequest,
  Comment,
  ContentSimpleDTO,
} from '@/app/types/content';

export const ContentQueryFactory = (baseKey: QueryKey) => {
  const queryClient = useQueryClient();

  return {
    useGetById: (contentId: string, userId: string) =>
      useQuery<Content>({
        queryKey: [...baseKey, 'contentDetails', contentId, userId],
        queryFn: () => contentServices.getById(contentId, userId),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!contentId && !!userId,
      }),

    useGetList: (userId: string, profileMode?: boolean) =>
      useQuery<ContentSimpleDTO[]>({
        queryKey: [...baseKey, 'contentList', userId, profileMode],
        queryFn: () => contentServices.getAll(userId, profileMode),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!userId,
      }),

    useGetCategories: () =>
      useQuery<ContentCategory[]>({
        queryKey: [...baseKey, 'contentCategories'],
        queryFn: () => contentServices.getCategories(),
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 10,
        retry: 1,
        refetchOnWindowFocus: false,
      }),

    useCreateContent: () =>
      useMutation<
        Content,
        Error,
        { contentData: CreateContentRequest; userId: string }
      >({
        mutationFn: ({ contentData, userId }) =>
          contentServices.createContent(contentData, userId),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [...baseKey, 'contentList'],
          });
        },
      }),

    useCreateContentWithFiles: () =>
      useMutation<
        Content,
        Error,
        { contentData: CreateContentWithFilesRequest; userId: string }
      >({
        mutationFn: ({ contentData, userId }) =>
          contentServices.createContentWithFiles(contentData, userId),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [...baseKey, 'contentList'],
          });
        },
      }),

    useUpdateContent: () =>
      useMutation<
        Content,
        Error,
        { id: string; contentData: UpdateContentRequest; userId: string }
      >({
        mutationFn: ({ id, contentData, userId }) =>
          contentServices.updateContent(id, contentData, userId),
        onSuccess: (_, { id }) => {
          queryClient.invalidateQueries({
            queryKey: [...baseKey, 'contentDetails', id],
          });
          queryClient.invalidateQueries({
            queryKey: [...baseKey, 'contentList'],
          });
        },
      }),

    useDeleteContent: () =>
      useMutation<void, Error, string>({
        mutationFn: (contentId) => contentServices.deleteContent(contentId),
        onSuccess: (_, contentId) => {
          queryClient.removeQueries({
            queryKey: [...baseKey, 'contentDetails', contentId],
          });
          queryClient.invalidateQueries({
            queryKey: [...baseKey, 'contentList'],
          });
        },
      }),

    useToggleLike: () =>
      useMutation<void, Error, { id: string; liked: boolean; userId: string }>({
        mutationFn: ({ id, liked, userId }) =>
          contentServices.toggleLike(id, liked, userId),
        onSuccess: (_, { id }) => {
          queryClient.invalidateQueries({
            queryKey: [...baseKey, 'contentDetails', id],
          });
          queryClient.invalidateQueries({
            queryKey: [...baseKey, 'contentList'],
          });
        },
      }),

    useToggleRepost: () =>
      useMutation<void, Error, { id: string; reposted: boolean; userId: string }>(
        {
          mutationFn: ({ id, reposted, userId }) =>
            contentServices.toggleRepost(id, reposted, userId),
          onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({
              queryKey: [...baseKey, 'contentDetails', id],
            });
            queryClient.invalidateQueries({
              queryKey: [...baseKey, 'contentList'],
            });
          },
        },
      ),

    useCreateComment: () =>
      useMutation<
        void,
        Error,
        {
          contentId: number;
          authorId: number;
          text: string;
          replyToCommentId?: number;
        }
      >({
        mutationFn: (commentData) => contentServices.createComment(commentData),
        onSuccess: (_, { contentId }) => {
          queryClient.invalidateQueries({
            queryKey: [...baseKey, 'contentDetails', contentId.toString()],
          });
        },
      }),

    useReportContent: () =>
      useMutation<
        void,
        Error,
        { contentId: string; reason: string; userId: string }
      >({
        mutationFn: ({ contentId, reason, userId }) =>
          contentServices.reportContent(contentId, reason, userId),
      }),

    useToggleSaveContent: () =>
      useMutation<
        void,
        Error,
        { contentId: string; userId: string; control: boolean }
      >({
        mutationFn: ({ contentId, userId, control }) =>
          contentServices.toggleSaveContent(contentId, userId, control),
        onSuccess: (_, { contentId }) => {
          queryClient.invalidateQueries({
            queryKey: [...baseKey, 'contentDetails', contentId],
          });
          queryClient.invalidateQueries({
            queryKey: [...baseKey, 'contentList'],
          });
        },
      }),

    useGetSavedContent: () =>
      useQuery<Content[]>({
        queryKey: [...baseKey, 'savedContent'],
        queryFn: () => contentServices.getSavedContent(),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
      }),

    useLikeComment: () =>
      useMutation<void, Error, string>({
        mutationFn: (commentId) => contentServices.likeComment(commentId),
      }),

    useGetCommentReplies: (commentId: string, page: number = 0, size: number = 10) =>
      useQuery<Comment[]>({
        queryKey: [...baseKey, 'commentReplies', commentId, page, size],
        queryFn: () => contentServices.getCommentReplies(commentId, page, size),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
        retry: 1,
        enabled: !!commentId,
      }),

    useUploadMedia: () =>
      useMutation<MediaDTO, Error, FormData>({
        mutationFn: (files) => contentServices.uploadMedia(files),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [...baseKey, 'contentList'],
          });
        },
      }),
  };
};

const useContentQueries = (queryKey: QueryKey) => {
  const queries = ContentQueryFactory(queryKey);
  return {
    ...queries,
  };
};

export default useContentQueries;