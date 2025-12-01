import apiFactory from "@/app/services/apiFactory";
import { API_BASE_URL } from "@/app/config/env";
import apiRoutes from "@/app/utils/apiRoutes";
import { User } from "../schema/usersSchema";

const api = apiFactory(API_BASE_URL ?? "");

export const getUsers = async (): Promise<User[]> => {
  const response = await api.get(apiRoutes.admin.listUsers);
  const data = Array.isArray(response.data) ? response.data : [];

  return data.map((raw: any): User => ({
    id: Number(raw.id),
    nome: raw.name || raw.nome || "",
    email: raw.email || "",
    perfil:
      raw.role === "ADMIN" || raw.role === "ROLE_ADMIN"
        ? "Admin"
        : raw.role === "HEALTH" || raw.role === "ROLE_HEALTH"
        ? "Saúde"
        : "Usuário",
    status: raw.blocked ? "Bloqueado" : "Ativo",
  }));
};

export const setUser = async (updatedUser: User): Promise<User> => {
  const payload = {
    userId: updatedUser.id,
    role:
      updatedUser.perfil === "Admin"
        ? "ADMIN"
        : updatedUser.perfil === "Saúde"
        ? "HEALTH"
        : "USER",
    blocked: updatedUser.status === "Bloqueado",
  };

  await api.post(apiRoutes.admin.setUserRole, payload);
  return updatedUser;
};
