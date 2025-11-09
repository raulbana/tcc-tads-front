import apiFactory from "@/app/services/apiFactory";
import apiRoutes from "@/app/utils/apiRoutes";
import { API_BASE_URL } from "@/app/config/env";
import {
  CalendarDayData,
  CalendarDayDTO,
  CalendarRangeResponse,
  CalendarRangeResponseDTO,
  CalendarRequestDTO,
  ReportDTO,
  mapCalendarDayDTOToData,
  mapCalendarRangeDTOToData,
  normalizeTimeToHHMMSS,
} from "@/app/types/diary";

const api = apiFactory(API_BASE_URL ?? "");

const toISODate = (date: Date) => date.toISOString().split("T")[0];

const appendOptionalDateParams = (from?: string, to?: string) => {
  const params = new URLSearchParams();
  if (from) params.append("from", from);
  if (to) params.append("to", to);
  return params;
};

const ensureUserId = (userId?: string) => {
  if (!userId) {
    throw new Error("Usuário não autenticado");
  }
  return userId;
};

export const diaryServices = {
  async getCalendarEvents(
    fromDate: Date,
    toDate: Date,
    userId?: string
  ): Promise<CalendarRangeResponse> {
    if (!userId) {
      return {};
    }

    const from = toISODate(fromDate);
    const to = toISODate(toDate);
    const params = appendOptionalDateParams(from, to);
    const queryString = params.toString();

    const response = await api.get<CalendarRangeResponseDTO>(
      `${apiRoutes.diary.calendar}${queryString ? `?${queryString}` : ""}`,
      {
        headers: {
          "user-Id": ensureUserId(userId),
        },
      }
    );

    return mapCalendarRangeDTOToData(response.data ?? {});
  },

  async setCalendarEvent(
    request: CalendarRequestDTO,
    userId?: string
  ): Promise<CalendarDayData> {
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    const normalizedPayload: CalendarRequestDTO = {
      ...request,
      urinationData: request.urinationData?.map((urination) => ({
        ...urination,
        time: normalizeTimeToHHMMSS(urination.time),
      })),
    };

    const response = await api.put<CalendarDayDTO>(
      apiRoutes.diary.calendar,
      normalizedPayload,
      {
        headers: {
          "user-Id": ensureUserId(userId),
        },
      }
    );

    return mapCalendarDayDTOToData(response.data);
  },

  async getReport(
    from: string,
    to: string,
    userId?: string
  ): Promise<ReportDTO> {
    if (!userId) {
      throw new Error("Usuário não autenticado");
    }

    const params = appendOptionalDateParams(from, to);
    const response = await api.get<ReportDTO>(
      `${apiRoutes.diary.report}?${params.toString()}`,
      {
        headers: {
          "X-User-Id": ensureUserId(userId),
        },
      }
    );

    return response.data;
  },
};

export default diaryServices;
