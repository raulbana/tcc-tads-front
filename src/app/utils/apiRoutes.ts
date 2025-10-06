const apiRoutes = {
  authentication: {
    login: '/auth/login',
    register: '/auth/register',
    forgotPasswordRequest: '/auth/forgot-password/request',
    forgotPasswordValidate: '/auth/forgot-password/validate',
  },
  onboarding: {
    questions: {
      onboarding: '/questions/onboard',
    },
  },
  content: {
    all: '/contents',
    category: '/contents/category',
    byId: (contentId: string) => `/contents/${contentId}`,
  },
};

export default apiRoutes;
