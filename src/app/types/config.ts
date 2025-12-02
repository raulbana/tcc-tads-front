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
    id?: number;
    url: string;
    contentType: string;
    contentSize: number;
    altText: string;
    createdAt: string;
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
