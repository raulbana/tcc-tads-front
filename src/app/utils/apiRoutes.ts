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
    },
  },
  content: {
    all: "/contents",
    category: "/contents/category",
    byId: (contentId: string) => `/contents/${contentId}`,
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
  admin: {
    listUsers: "/admin/users",
    setUserRole: "/admin/users/role",
    listReports: "/admin/reports",
    validateReport: "/admin/reports/validate",
    applyStrike: "/admin/reports/strike",
  },
};

export default apiRoutes;
export { apiRoutes };
