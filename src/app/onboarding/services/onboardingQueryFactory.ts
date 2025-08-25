import { useQuery, QueryKey } from '@tanstack/react-query';
import { Question } from '../../../types/question';
import onboardingServices from '../services/onboardingServices';

export const onboardingQueryFactory = (queryKey: QueryKey) => {
  return {
    getQuestions: () => useQuery<Question[]>({
      queryKey: [...queryKey],
      queryFn: () => onboardingServices.getQuestions(),
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
      select: (data: Question[]) => data.map((question) => ({
        ...question,
      })),
    }),
  };
};

const useOnboardingQueries = (queryKey: QueryKey) => {
  const queries = onboardingQueryFactory(queryKey);
  return {
    ...queries
  };
};

export default useOnboardingQueries;
