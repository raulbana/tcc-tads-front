const apiRoutes = {
  authentication: {
    login: '/users/login',
    register: '/users',
    forgotPasswordRequest: '/users/password/forgot',
    forgotPasswordValidate: '/users/password/reset',
  },
  onboarding: {
    questions: {
      onboarding: '/questions/onboard',
    },
  },
  content: {
    all: '/content',
    byId: (contentId: string) => `/content/${contentId}`,
    create: '/content',
    update: (contentId: string) => `/content/${contentId}`,
    delete: (contentId: string) => `/content/${contentId}`,
    like: (contentId: string) => `/content/${contentId}`,
    repost: (contentId: string) => `/content/repost/${contentId}`,
    report: (contentId: string) => `/content/${contentId}/report`,
    save: (contentId: string) => `/content/${contentId}/save`,
    categories: '/content/category',
    user: (userId: string) => `/content?userId=${userId}`,
    saved: '/content/saved',
    comments: (contentId: string) => `/content/comments/${contentId}`,
    comment: (commentId: string) => `/content/comments/${commentId}`,
    commentLike: (commentId: string) => `/content/comments/${commentId}`,
    commentReplies: (commentId: string) => `/content/comments/${commentId}/replies`,
  },
  media: {
    upload: '/media/upload',
  },
  contact: '/contact/support',
};

export default apiRoutes;
export { apiRoutes };
