const apiRoutes = {
  authentication: {
    login: "/users/login",
    register: "/users",
    forgotPasswordRequest: "/users/password/forgot",
    forgotPasswordValidate: "/users/password/reset",
  },
  onboarding: {
    questions: {
      onboarding: "/questions/onboard",
      submit: "/questions/onboard",
    },
  },
  content: {
    all: "/content",
    byId: (contentId: string) => `/content/${contentId}`,
    create: "/content",
    update: (contentId: string) => `/content/${contentId}`,
    delete: (contentId: string) => `/content/${contentId}`,
    like: (contentId: string) => `/content/${contentId}`,
    repost: (contentId: string) => `/content/repost/${contentId}`,
    report: (contentId: string) => `/content/${contentId}/report`,
    save: (contentId: string) => `/content/${contentId}/save`,
    categories: "/content/category",
    categoryById: (id: string) => `/content/category/${id}`,
    user: (userId: string) => `/content?userId=${userId}`,
    saved: "/content/saved",
    comments: (contentId: string) => `/content/comments/${contentId}`,
    comment: (commentId: string) => `/content/comments/${commentId}`,
    createComment: "/content/comments",
    commentLike: (commentId: string) => `/content/comments/${commentId}`,
    commentReplies: (commentId: string) =>
      `/content/comments/${contentId}/replies`,
  },
  media: {
    upload: "/media/upload",
  },
  exercises: {
    listExercises: "/exercise",
    getExerciseById: (id: string) => `/exercise/${id}`,
    listWorkouts: "/exercise/workout",
    getWorkoutById: (id: string) => `/exercise/workout/${id}`,
    listWorkoutPlans: "/exercise/workout/plan",
    getWorkoutPlanById: (id: string) => `/exercise/workout/plan/${id}`,
    getUserWorkoutPlan: "/users/workout/plan",
    submitWorkoutFeedback: "/users/workout/feedback",
    submitWorkoutCompletion: "/users/workout/completion",
    categories: {
      list: "/exercise/category",
      byId: (id: string) => `/exercise/category/${id}`,
    },
    attributes: {
      list: "/exercise/attribute",
      byId: (id: string) => `/exercise/attribute/${id}`,
    },
  },
  diary: {
    calendar: "/calendar",
    report: "/report",
  },
  contact: "/contact/support",
  accessibility: {
    get: "/preferences/accessibility",
    update: "/preferences/accessibility",
  },
  profile: {
    edit: (userId: number) => `/users/${userId}`,
    getById: (userId: number) => `/users/${userId}`,
  },
  admin: {
    listUsers: "/admin/users",
    setUserRole: "/admin/users/role",
    setUserStatus: "/admin/users/status",
    listReports: "/admin/reports",
    validateReport: "/admin/reports/validate",
    applyStrike: "/admin/reports/strike",
  },
};

export default apiRoutes;
export { apiRoutes };
