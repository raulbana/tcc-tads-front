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
