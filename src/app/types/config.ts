export interface ContactRequest {
  userEmail: string;
  subject: string;
  text: string;
}

export interface AccessibilityPreferences {
  isBigFont: boolean;
  isHighContrast: boolean;
  isDarkMode: boolean;
}

export interface ContactResponse {
  message: string;
  status: string;
}

export interface EditProfileRequest {
  name: string;
  email: string;
  profilePicture?: {
    url: string;
    contentType: string;
    contentSize: number;
    altText: string;
  };
}

export interface EditProfileResponse {
  id: number;
  name: string;
  email: string;
  profilePictureUrl?: string;
  role?: string;
  profile: {
    iciqScore: number;
    id: string;
    birthDate: string;
    gender: string;
    q1Score: number;
    q2Score: number;
    q3Score: number;
    q4Score: number;
  };
  preferences: {
    highContrast: boolean;
    bigFont: boolean;
    darkMode: boolean;
    reminderCalendar: boolean;
    reminderCalendarSchedule?: string;
    reminderWorkout: boolean;
    reminderWorkoutSchedule?: string;
    encouragingMessages: boolean;
    workoutMediaType: string;
  };
}

export interface UserSimpleDTO {
  id: number;
  name: string;
  email: string;
  role: string;
  profilePictureUrl?: string;
  curtidas: number;
  salvos: number;
  postagens: number;
}
