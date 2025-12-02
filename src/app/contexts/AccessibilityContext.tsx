"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from "react";
import { useAuth } from "./AuthContext";
import { AccessibilityPreferences } from "@/app/types/config";
import configServices from "@/app/services/configServices";

interface AccessibilityContextType {
  highContrast: boolean;
  bigFont: boolean;
  darkMode: boolean;
  isLoading: boolean;
  error: string | null;
  saveAccessibilityPreferences: (
    preferences: AccessibilityPreferences
  ) => Promise<void>;
  loadAccessibilityPreferences: () => Promise<void>;
  clearError: () => void;
}

const AccessibilityContext = createContext<
  AccessibilityContextType | undefined
>(undefined);

interface AccessibilityProviderProps {
  children: ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth();

  const [highContrast, setHighContrast] = useState(false);
  const [bigFont, setBigFont] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const applyDocumentTheme = useCallback(
    (options?: {
      highContrast?: boolean;
      bigFont?: boolean;
      darkMode?: boolean;
    }) => {
      if (typeof document === "undefined") return;

      const root = document.documentElement;
      const hc = options?.highContrast ?? highContrast;
      const bf = options?.bigFont ?? bigFont;
      const dm = options?.darkMode ?? darkMode;

      root.dataset.highContrast = hc ? "true" : "false";
      root.dataset.bigFont = bf ? "true" : "false";

      let themeKey: "default" | "high-contrast" | "dark" = "default";
      if (hc) {
        themeKey = "high-contrast";
      } else if (dm) {
        themeKey = "dark";
      }
      root.dataset.theme = themeKey;
    },
    [highContrast, bigFont, darkMode]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadAccessibilityPreferences = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (isAuthenticated && user) {
        try {
          const preferences = await configServices.getAccessibilityPreferences(
            String(user.id)
          );
          setHighContrast(preferences.isHighContrast);
          setBigFont(preferences.isBigFont);
          setDarkMode(preferences.isDarkMode);
          applyDocumentTheme({
            highContrast: preferences.isHighContrast,
            bigFont: preferences.isBigFont,
            darkMode: preferences.isDarkMode,
          });
        } catch (apiError) {
          const localPreferences = user.preferences;
          setHighContrast(localPreferences.highContrast);
          setBigFont(localPreferences.bigFont);
          setDarkMode(localPreferences.darkMode);
          applyDocumentTheme({
            highContrast: localPreferences.highContrast,
            bigFont: localPreferences.bigFont,
            darkMode: localPreferences.darkMode,
          });
        }
      } else if (user) {
        const localPreferences = user.preferences;
        setHighContrast(localPreferences.highContrast);
        setBigFont(localPreferences.bigFont);
        setDarkMode(localPreferences.darkMode);
        applyDocumentTheme({
          highContrast: localPreferences.highContrast,
          bigFont: localPreferences.bigFont,
          darkMode: localPreferences.darkMode,
        });
      } else {
        setHighContrast(false);
        setBigFont(false);
        setDarkMode(false);
        applyDocumentTheme({
          highContrast: false,
          bigFont: false,
          darkMode: false,
        });
      }
    } catch (err) {
      setError("Erro ao carregar preferências de acessibilidade");
    } finally {
      setIsLoading(false);
    }
  }, [applyDocumentTheme, isAuthenticated, user]);

  const saveAccessibilityPreferences = useCallback(
    async (preferences: AccessibilityPreferences) => {
      try {
        setIsLoading(true);
        setIsSaving(true);
        setError(null);

        setHighContrast(preferences.isHighContrast);
        setBigFont(preferences.isBigFont);
        setDarkMode(preferences.isDarkMode);
        applyDocumentTheme({
          highContrast: preferences.isHighContrast,
          bigFont: preferences.isBigFont,
          darkMode: preferences.isDarkMode,
        });

        if (user) {
          const updatedPreferences = {
            ...user.preferences,
            highContrast: preferences.isHighContrast,
            bigFont: preferences.isBigFont,
            darkMode: preferences.isDarkMode,
          };

          try {
            await configServices.updateAccessibilityPreferences(
              String(user.id),
              preferences
            );
          } catch (apiError) {
          }
        }
      } catch (err) {
        setError("Erro ao salvar preferências de acessibilidade");
        if (user) {
          setHighContrast(user.preferences.highContrast);
          setBigFont(user.preferences.bigFont);
          setDarkMode(user.preferences.darkMode);
          applyDocumentTheme({
            highContrast: user.preferences.highContrast,
            bigFont: user.preferences.bigFont,
            darkMode: user.preferences.darkMode,
          });
        }
        throw err;
      } finally {
        setIsLoading(false);
        setTimeout(() => {
          setIsSaving(false);
        }, 100);
      }
    },
    [applyDocumentTheme, user]
  );

  useEffect(() => {
    if (user && !isSaving) {
      loadAccessibilityPreferences();
    } else if (!user) {
      setHighContrast(false);
      setBigFont(false);
      setDarkMode(false);
      applyDocumentTheme({
        highContrast: false,
        bigFont: false,
        darkMode: false,
      });
    }
  }, [user?.id, loadAccessibilityPreferences, isSaving, applyDocumentTheme]);

  const value = useMemo(
    () => ({
      highContrast,
      bigFont,
      darkMode,
      isLoading,
      error,
      saveAccessibilityPreferences,
      loadAccessibilityPreferences,
      clearError,
    }),
    [
      highContrast,
      bigFont,
      darkMode,
      isLoading,
      error,
      saveAccessibilityPreferences,
      loadAccessibilityPreferences,
      clearError,
    ]
  );

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = (): AccessibilityContextType => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error(
      "useAccessibility deve ser usado dentro de AccessibilityProvider"
    );
  }
  return context;
};
