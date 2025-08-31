import apiFactory from "@/app/services/apiFactory";
import { Question } from "@/app/types/question";
import { apiRoutes } from "@/app/utils/apiRoutes";
import { API_BASE_URL } from "@/app/config/env";

const apiInstance = apiFactory(API_BASE_URL);

const onboardingServices = {
  async getQuestions(): Promise<Question[]> {
    const path = apiRoutes.onboarding.questions.onboarding;
    const { data } = await apiInstance.get<Question[]>(path);
    return data;
  },
};

export default onboardingServices;