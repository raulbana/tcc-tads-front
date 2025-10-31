import { User } from "../schema/usersSchema";

let usersMock: User[] = [
  {
    id: 1,
    nome: "Pedro Souza",
    email: "pedro@email.com",
    perfil: "Admin",
    status: "Ativo",
  },
  {
    id: 2,
    nome: "Maria Lima",
    email: "maria@email.com",
    perfil: "Usuário",
    status: "Bloqueado",
  },
  {
    id: 3,
    nome: "Carlos Oliveira",
    email: "carlos@health.com",
    perfil: "Saúde",
    status: "Ativo",
  },
  {
    id: 4,
    nome: "Ana Costa",
    email: "ana@empresa.com",
    perfil: "Usuário",
    status: "Ativo",
  },
];

export const getUsers = async (): Promise<User[]> => {
  return usersMock;
};

export const setUser = async (updatedUser: User): Promise<User> => {
  usersMock = usersMock.map((user) =>
    user.id === updatedUser.id ? { ...user, ...updatedUser } : user
  );
  return updatedUser;
};
