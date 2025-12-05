export interface User {
  id: number;
  name: string;
  email: string;
  profilePictureUrl?: string;
  role?: string;
  profile: PatientProfile;
  preferences: Preferences;
  curtidas?: number;
  salvos?: number;
  postagens?: number;
}

export interface UserRole {
  description: string;
  permissionLevel: number;
  reason: string;
  hasDocument: boolean;
  documentType: string | null;
  documentValue: string | null;
  conceivedBy: string | null;
  conceivedAt: string;
}

export const userRoles: Record<
  string,
  { permissionLevel: number; description: string }
> = {
  USER: {
    permissionLevel: 1,
    description: "Usuário comum",
  },
  PROFESSIONAL: {
    permissionLevel: 2,
    description: "Profissional",
  },
  ADMIN: {
    permissionLevel: 3,
    description: "Administrador",
  },
};

export interface PatientProfile {
  id: string;
  birthDate: string;
  gender: Gender;
  q1Score: number;
  q2Score: number;
  q3Score: number;
  q4Score: number;
}

export interface Preferences {
  highContrast: boolean;
  bigFont: boolean;
  darkMode: boolean;
  reminderCalendar: boolean;
  reminderCalendarSchedule?: string;
  reminderWorkout: boolean;
  reminderWorkoutSchedule?: string;
  encouragingMessages: boolean;
  workoutMediaType: WorkoutMediaType;
}

export type Gender = "male" | "female";
export type WorkoutMediaType = "video" | "image";

export interface loginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface loginResponse {
  token: string;
  user: User;
}

export interface PatientProfileDTO {
  birthDate: string;
  gender: string;
  iciq3answer: number;
  iciq4answer: number;
  iciq5answer: number;
  iciqScore: number;
  urinationLoss: string;
}

export interface UserWorkoutPlanCreatorDTO {
  planId: number;
  startDate: string;
  endDate?: string;
  totalProgress: number;
  weekProgress: number;
  currentWeek: number;
  completed: boolean;
}

export interface registerRequest {
  name: string;
  email: string;
  password: string;
  profile?: PatientProfileDTO;
  workoutPlan?: UserWorkoutPlanCreatorDTO;
}

export interface registerResponse {
  id: number;
  name: string;
  email: string;
  profilePictureUrl?: string;
  role?: string;
  profile: PatientProfile;
  preferences: Preferences;
}

export interface forgotPasswordRequestRequest {
  email: string;
}

export interface forgotPasswordRequestResponse {
  message: string;
  status: string;
}

export interface forgotPasswordValidateRequest {
  otp: string;
  email: string;
  newPassword: string;
}

export interface forgotPasswordValidateResponse {
  message: string;
  status: string;
}

export interface updateUserRequest {
  id: number;
  name: string;
  email: string;
  profilePictureUrl?: string;
  profile: PatientProfile;
  preferences: Preferences;
}

export interface updateUserResponse {
  message: string;
  status: string;
}

export interface getUserByIdResponse {
  id: number;
  name: string;
  email: string;
  profilePictureUrl?: string;
  profile: PatientProfile;
  preferences: Preferences;
}
