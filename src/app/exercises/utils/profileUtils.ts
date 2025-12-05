import { PatientProfileDTO } from "@/app/types/auth";

export const shouldBlockExercises = (profile: PatientProfileDTO): boolean => {
  return profile.iciqScore > 12;
};




