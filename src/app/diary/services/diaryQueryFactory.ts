import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { diaryServices } from "./diaryServices";
import { CalendarRangeResponse } from "@/app/types/diary";

const useDiaryQueries = (queryKey: string[]) => {
  const useGetByRange = (
    fromDate: Date,
    toDate: Date
  ): UseQueryResult<CalendarRangeResponse, Error> => {
    return useQuery({
      queryKey: [...queryKey, "range", fromDate.toISOString(), toDate.toISOString()],
      queryFn: () => diaryServices.getCalendarRange(fromDate, toDate),
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
    });
  };

  return {
    useGetByRange,
  };
};

export default useDiaryQueries;