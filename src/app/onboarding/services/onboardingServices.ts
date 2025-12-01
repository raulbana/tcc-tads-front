import apiFactory from "@/app/services/apiFactory";
import { Question } from "@/app/types/question";
import { apiRoutes } from "@/app/utils/apiRoutes";
import { API_BASE_URL } from "@/app/config/env";
import { OnboardSubmitDTO, OnboardCompleteDTO } from "@/app/types/onboarding";

const apiInstance = apiFactory(API_BASE_URL);

const onboardingServices = {
  async getQuestions(): Promise<Question[]> {
    const path = apiRoutes.onboarding.questions.onboarding;
    const { data } = await apiInstance.get<Question[]>(path);
    return data;
  },

  async submitAnswers(submitData: OnboardSubmitDTO): Promise<OnboardCompleteDTO> {
    const path = apiRoutes.onboarding.questions.submit;
    const response = await apiInstance.post<OnboardCompleteDTO>(path, submitData);
    return response.data;
  },
};

export default onboardingServices;