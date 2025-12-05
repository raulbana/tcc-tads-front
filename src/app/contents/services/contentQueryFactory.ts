import {
  QueryKey,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import contentServices from "./contentServices";
import {
  Content,
  ContentCategory,
  CreateContentRequest,
  CreateContentWithFilesRequest,
  UpdateContentRequest,
  Comment,
  ContentSimpleDTO,
  MediaDTO,
} from "@/app/types/content";
import { contentCache } from "./contentCache";

export const ContentQueryFactory = (baseKey: QueryKey) => {
  const queryClient = useQueryClient();

  return {
    useGetById: (contentId: string, userId: string) =>
      useQuery<Content>({
        queryKey: [...baseKey, "contentDetails", contentId, userId],
        queryFn: () => contentServices.getById(contentId, userId),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!contentId && !!userId,
      }),

    useGetList: (userId: string, profileMode?: boolean) =>
      useQuery<ContentSimpleDTO[]>({
        queryKey: [...baseKey, "contentList", userId, profileMode],
        queryFn: () => contentServices.getAll(userId, profileMode),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
        retry: 1,
        refetchOnWindowFocus: false,
        enabled: !!userId,
      }),

    useGetCategories: () =>
      useQuery<ContentCategory[]>({
        queryKey: [...baseKey, "contentCategories"],
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
            queryKey: [...baseKey, "contentList"],
          });
          queryClient.invalidateQueries({
            queryKey: ["profile", "user"],
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
            queryKey: [...baseKey, "contentList"],
          });
          queryClient.invalidateQueries({
            queryKey: ["profile", "user"],
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
            queryKey: [...baseKey, "contentDetails", id],
            exact: false,
          });
          queryClient.invalidateQueries({
            queryKey: [...baseKey, "contentList"],
          });
        },
      }),

    useDeleteContent: () =>
      useMutation<void, Error, string>({
        mutationFn: (contentId) => contentServices.deleteContent(contentId),
        onSuccess: (_, contentId) => {
          queryClient.removeQueries({
            queryKey: [...baseKey, "contentDetails", contentId],
          });
          queryClient.invalidateQueries({
            queryKey: [...baseKey, "contentList"],
          });
          queryClient.invalidateQueries({
            queryKey: ["profile", "user"],
          });
        },
      }),

    useToggleLike: () =>
      useMutation<void, Error, { id: string; liked: boolean; userId: string }>({
        mutationFn: ({ id, liked, userId }) =>
          contentServices.toggleLike(id, liked, userId),
        onSuccess: (_, { id }) => {
          queryClient.invalidateQueries({
            queryKey: [...baseKey, "contentDetails", id],
            exact: false,
          });
          queryClient.invalidateQueries({
            queryKey: [...baseKey, "contentList"],
          });
        },
      }),

    useToggleRepost: () =>
      useMutation<
        void,
        Error,
        { id: string; reposted: boolean; userId: string }
      >({
        mutationFn: ({ id, reposted, userId }) =>
          contentServices.toggleRepost(id, reposted, userId),
        onSuccess: (_, { id }) => {
          queryClient.invalidateQueries({
            queryKey: [...baseKey, "contentDetails", id],
            exact: false,
          });
          queryClient.invalidateQueries({
            queryKey: [...baseKey, "contentList"],
          });
        },
      }),

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
            queryKey: [...baseKey, "contentDetails", contentId.toString()],
            exact: false,
          });
          contentCache.invalidateContent(contentId.toString());
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
        { contentId: string; userId: number; control: boolean }
      >({
        mutationFn: ({ contentId, userId, control }) =>
          contentServices.toggleSaveContent(contentId, userId, control),
        onSuccess: (_, { contentId, userId, control }) => {
          queryClient.setQueryData<Content>(
            [...baseKey, "contentDetails", contentId, userId.toString()],
            (previous) =>
              previous ? { ...previous, isSaved: control } : previous
          );

          queryClient.invalidateQueries({
            queryKey: [...baseKey, "contentList"],
            exact: false,
          });

          queryClient.invalidateQueries({
            queryKey: [...baseKey, "savedContent"],
          });
          queryClient.invalidateQueries({
            queryKey: ["profile", "user"],
          });
        },
      }),

    useGetSavedContent: () =>
      useQuery<Content[]>({
        queryKey: [...baseKey, "savedContent"],
        queryFn: () => contentServices.getSavedContent(),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
      }),

    useGetComments: (
      contentId: string,
      userId: string,
      page?: number,
      size?: number
    ) =>
      useQuery<Comment[]>({
        queryKey: [...baseKey, "comments", contentId, userId, page, size],
        queryFn: () =>
          contentServices.getComments(contentId, userId, page, size),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
        retry: 1,
        enabled: !!contentId && !!userId,
      }),

    useUpdateComment: () =>
      useMutation<
        Comment,
        Error,
        { commentId: string; text: string; userId: string }
      >({
        mutationFn: ({ commentId, text, userId }) =>
          contentServices.updateComment(commentId, text, userId),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [...baseKey, "comments"],
          });
          queryClient.invalidateQueries({
            queryKey: [...baseKey, "contentDetails"],
            exact: false,
          });
        },
      }),

    useDeleteComment: () =>
      useMutation<void, Error, string>({
        mutationFn: (commentId) => contentServices.deleteComment(commentId),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [...baseKey, "comments"],
          });
          queryClient.invalidateQueries({
            queryKey: [...baseKey, "contentDetails"],
            exact: false,
          });
        },
      }),

    useLikeComment: () =>
      useMutation<
        void,
        Error,
        { commentId: string; userId: number; liked: boolean }
      >({
        mutationFn: ({ commentId, userId, liked }) =>
          contentServices.likeComment(commentId, userId, liked),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [...baseKey, "comments"],
          });
          queryClient.invalidateQueries({
            queryKey: [...baseKey, "commentReplies"],
            exact: false,
          });
        },
      }),

    useGetCommentReplies: (
      commentId: string,
      userId: string,
      page: number = 0,
      size: number = 10
    ) =>
      useQuery<Comment[]>({
        queryKey: [...baseKey, "commentReplies", commentId, userId, page, size],
        queryFn: () =>
          contentServices.getCommentReplies(commentId, userId, page, size),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 5,
        retry: 1,
        enabled: !!commentId && !!userId,
      }),

    useUploadMedia: () =>
      useMutation<MediaDTO, Error, FormData>({
        mutationFn: (files) => contentServices.uploadMedia(files),
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: [...baseKey, "contentList"],
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
