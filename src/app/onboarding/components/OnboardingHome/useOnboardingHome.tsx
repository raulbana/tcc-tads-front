import { useRouter } from "next/navigation";

const useOnboardingHome = () => {
  const router = useRouter();

  const navigateToQuestionnaire = () => {
    router.push("/onboarding/questionnaire");
  };

  return {
    navigateToQuestionnaire,
  };
};

export default useOnboardingHome;
