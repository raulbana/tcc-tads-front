import { Question } from '@/app/types/question';
import { OnboardSubmitDTO, OnboardCompleteDTO } from '@/app/types/onboarding';
import onboardingServices from '../services/onboardingServices';
import { useQuery, useMutation, QueryKey } from '@tanstack/react-query';

const useOnboardingQueries = (queryKey: QueryKey) => {
  const getQuestions = useQuery<Question[]>({
    queryKey: [...queryKey],
    queryFn: () => onboardingServices.getQuestions(),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnWindowFocus: false,
    select: (data: Question[]) => data.map((question) => ({
      ...question,
    })),
  });

  const submitAnswers = useMutation<OnboardCompleteDTO, Error, OnboardSubmitDTO>({
    mutationFn: (data: OnboardSubmitDTO) => onboardingServices.submitAnswers(data),
  });

  return {
    getQuestions,
    submitAnswers,
  };
};

export default useOnboardingQueries;
