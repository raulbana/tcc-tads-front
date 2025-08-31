import { Question } from '@/app/types/question';
import onboardingServices from '../services/onboardingServices';
import { useQuery, QueryKey } from '@tanstack/react-query';

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

  return {
    getQuestions,
  };
};

export default useOnboardingQueries;
