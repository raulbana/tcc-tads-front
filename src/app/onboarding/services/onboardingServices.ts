import apiFactory from "@/app/services/apiFactory";
import { Question } from "@/app/types/question";
import apiRoutes from "@/app/utils/apiRoutes";

const BASE_URL = process.env.BASE_URL ?? "";

const apiInstance = apiFactory(BASE_URL);

const onboardingServices = {
  getQuestions: async (): Promise<Question[]> => {
    const response = await apiInstance.get(apiRoutes.onboarding.questions.onboarding);
    return response.data;
  },
}

export default onboardingServices;