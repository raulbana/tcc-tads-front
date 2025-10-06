export interface User {
  id: number;
  name: string;
  email: string;
  profilePictureUrl?: string;
  profile: PatientProfile;
  preferences: Preferences;
}

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
  reminderCalendar: boolean;
  reminderCalendarSchedule?: string;
  reminderWorkout: boolean;
  reminderWorkoutSchedule?: string;
  encouragingMessages: boolean;
  workoutMediaType: WorkoutMediaType;
}

export type Gender = 'male' | 'female' | 'other';
export type WorkoutMediaType = 'video' | 'image';

export interface loginRequest {
  email: string;
  password: string;
}

export interface loginResponse {
  token: string;
  user: User;
}

export interface registerRequest {
  name: string;
  email: string;
  password: string;
}

export interface registerResponse {
  message: string;
  status: string;
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
  newPassword: string;
  confirmPassword: string;
}

export interface forgotPasswordValidateResponse {
  message: string;
  status: string;
}