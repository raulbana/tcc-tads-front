import apiFactory from "@/app/services/apiFactory";
import { API_BASE_URL } from "@/app/config/env";
import { apiRoutes } from "@/app/utils/apiRoutes";
import { User, Role, Status } from "../schema/usersSchema";

const apiInstance = apiFactory(API_BASE_URL);

export const getUsers = async (): Promise<User[]> => {
  const { data } = await apiInstance.get<User[]>(apiRoutes.admin.listUsers);
  return data;
};

export const setUserRole = async (
  userId: number,
  role: Role
): Promise<User> => {
  const { data } = await apiInstance.put<User>(apiRoutes.admin.setUserRole, {
    userId,
    role,
  });
  return data;
};

export const setUserStatus = async (
  userId: number,
  status: Status
): Promise<User> => {
  const { data } = await apiInstance.put<User>(apiRoutes.admin.setUserStatus, {
    userId,
    status,
  });
  return data;
};
