"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  User,
  loginRequest,
  loginResponse,
  registerRequest,
  registerResponse,
  PatientProfileDTO,
  UserWorkoutPlanCreatorDTO,
} from "@/app/types/auth";
import { UserWorkoutPlanDTO } from "@/app/types/onboarding";
import { authService } from "@/app/services/authServices";

const ONBOARDING_PROFILE_KEY = "dailyiu_onboarding_profile";
const ONBOARDING_WORKOUT_PLAN_KEY = "dailyiu_onboarding_workout_plan";

interface AuthContextData {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: loginRequest) => Promise<void>;
  register: (userData: registerRequest) => Promise<void>;
  logout: () => void;
  updateUser: (userData: User) => void;
  saveOnboardingData: (
    profile: PatientProfileDTO,
    workoutPlan?: UserWorkoutPlanDTO
  ) => void;
  getOnboardingData: () => {
    profile: PatientProfileDTO | null;
    workoutPlan: UserWorkoutPlanDTO | null;
  };
  clearOnboardingData: () => void;
  hasOnboardingData: () => boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

interface AuthProviderProps {
  children: ReactNode;
}

const TOKEN_KEY = "dailyiu_token";
const USER_KEY = "dailyiu_user";

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = () => {
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        document.cookie = `${TOKEN_KEY}=${storedToken}; path=/; max-age=${
          60 * 60 * 24 * 7
        }`;
      }
    } catch (error) {
      clearStoredAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const storeAuth = (token: string, userData: User) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${
      60 * 60 * 24 * 7
    }`;
    setUser(userData);
  };

  const clearStoredAuth = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    document.cookie = `${TOKEN_KEY}=; path=/; max-age=0`;
    setUser(null);
  };

  const login = async (credentials: loginRequest): Promise<void> => {
    try {
      setIsLoading(true);

      const response: loginResponse = await authService.login(credentials);
      storeAuth(response.token, response.user);
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const saveOnboardingData = (
    profile: PatientProfileDTO,
    workoutPlan?: UserWorkoutPlanDTO
  ): void => {
    try {
      localStorage.setItem(ONBOARDING_PROFILE_KEY, JSON.stringify(profile));
      if (workoutPlan) {
        localStorage.setItem(
          ONBOARDING_WORKOUT_PLAN_KEY,
          JSON.stringify(workoutPlan)
        );
      }
    } catch (error) {}
  };

  const getOnboardingData = (): {
    profile: PatientProfileDTO | null;
    workoutPlan: UserWorkoutPlanDTO | null;
  } => {
    try {
      const profileStr = localStorage.getItem(ONBOARDING_PROFILE_KEY);
      const workoutPlanStr = localStorage.getItem(ONBOARDING_WORKOUT_PLAN_KEY);

      const profile = profileStr
        ? (JSON.parse(profileStr) as PatientProfileDTO)
        : null;
      const workoutPlan = workoutPlanStr ? JSON.parse(workoutPlanStr) : null;

      return { profile, workoutPlan };
    } catch (error) {
      return { profile: null, workoutPlan: null };
    }
  };

  const clearOnboardingData = (): void => {
    try {
      localStorage.removeItem(ONBOARDING_PROFILE_KEY);
      localStorage.removeItem(ONBOARDING_WORKOUT_PLAN_KEY);
    } catch (error) {}
  };

  const hasOnboardingData = (): boolean => {
    try {
      const profileStr = localStorage.getItem(ONBOARDING_PROFILE_KEY);
      return !!profileStr;
    } catch (error) {
      return false;
    }
  };

  const register = async (userData: registerRequest): Promise<void> => {
    try {
      setIsLoading(true);

      const onboardingData = getOnboardingData();

      if (onboardingData.profile && !userData.profile) {
        userData.profile = onboardingData.profile;
      }

      if (onboardingData.workoutPlan && !userData.workoutPlan) {
        if (
          onboardingData.workoutPlan.plan &&
          onboardingData.workoutPlan.plan.id
        ) {
          userData.workoutPlan = {
            planId: onboardingData.workoutPlan.plan.id,
            startDate: onboardingData.workoutPlan.startDate,
            endDate: onboardingData.workoutPlan.endDate,
            totalProgress: onboardingData.workoutPlan.totalProgress,
            weekProgress: onboardingData.workoutPlan.weekProgress,
            currentWeek: onboardingData.workoutPlan.currentWeek,
            completed: onboardingData.workoutPlan.completed,
          };
        }
      }

      const response = await authService.register(userData);

      if (response && response.id) {
        clearOnboardingData();

        await login({
          email: userData.email,
          password: userData.password,
        });
      } else {
        throw new Error("Erro no registro: resposta inválida do servidor");
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearStoredAuth();
  };

  const updateUser = useCallback((userData: User) => {
    setUser(userData);
    try {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (storedToken) {
        localStorage.setItem(USER_KEY, JSON.stringify(userData));
      }
    } catch (error) {
      console.error("Erro ao atualizar usuário no localStorage:", error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        updateUser,
        saveOnboardingData,
        getOnboardingData,
        clearOnboardingData,
        hasOnboardingData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextData => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
};
