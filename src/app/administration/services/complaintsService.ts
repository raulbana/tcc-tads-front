import apiFactory from "@/app/services/apiFactory";
import { API_BASE_URL } from "@/app/config/env";
import apiRoutes from "@/app/utils/apiRoutes";
import {
  contentAdminSchema,
  reportToggleSchema,
  type ContentAdmin,
  type ReportToggle,
} from "../schema/complaintsSchema";

const api = apiFactory(API_BASE_URL ?? "");

export const complaintsService = {
  async listComplaints(): Promise<ContentAdmin[]> {
    const response = await api.get(apiRoutes.admin.listReports);
    return contentAdminSchema.array().parse(response.data);
  },

  async validateReport(payload: ReportToggle): Promise<void> {
    const body = reportToggleSchema.parse(payload);
    await api.post(apiRoutes.admin.validateReport, body);
  },

  async applyStrike(contentId: number): Promise<void> {
    await api.post(
      apiRoutes.admin.applyStrike,
      {},
      {
        headers: {
          "x-content-id": contentId,
        },
      }
    );
  },
};

export default complaintsService;
