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
    all: '/contents',
    category: '/contents/category',
    byId: (contentId: string) => `/contents/${contentId}`,
  },
  contact: '/contact/support',
};

export default apiRoutes;
export { apiRoutes };
