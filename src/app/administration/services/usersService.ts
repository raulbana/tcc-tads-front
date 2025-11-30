import { User, userSchema } from "../schema/usersSchema";
import { API_BASE_URL } from "@/app/config/env";
import apiFactory from "@/app/services/apiFactory";
import { userRoles } from "@/app/types/auth";
import { apiRoutes } from "@/app/utils/apiRoutes";

const api = apiFactory(API_BASE_URL ?? "");

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get(apiRoutes.admin.listUsers);
  return userSchema.array().parse(response.data);
};

export const setUserStatus = async (userId: number, status: string) => {
  const statusUpdater = {
    targetUserId: userId,
    blocked: status === "Bloqueado",
  };
  await api.patch(
    apiRoutes.admin.setUserStatus,
    statusUpdater
  );
};

export const setUserRole = async (updatedUser: User): Promise<User> => {
    const userRoleDescription = Object.values(userRoles).find(
      (role) => role.permissionLevel === updatedUser.role.permissionLevel
    )?.description;
  
    const roleAssigner = {
      targetUserId: updatedUser.id,
      description: userRoleDescription,
      permissionLevel: updatedUser.role.permissionLevel,
      reason: updatedUser.role.reason,
      hasDocument: updatedUser.role.documentValue ? true : false,
      documentType: updatedUser.role.documentType,
      documentValue: updatedUser.role.documentValue
    }
  
    const response = await api.post(
      apiRoutes.admin.setUserRole,
      roleAssigner
    );
    return userSchema.parse(response.data);
};
