"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { getUsers, setUser } from "../../services/usersService";
import { User, Perfil, Status } from "../../schema/usersSchema";

export const useUsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [perfilFilter, setPerfilFilter] = useState<Perfil | "">("");
  const [statusFilter, setStatusFilter] = useState<Status | "">("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Buscar usuários do service
  const fetchUsers = useCallback(async () => {
    const data = await getUsers();
    setUsers(data);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Abrir modal com usuário selecionado
  const handleOpenModal = useCallback((user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  }, []);

  // Fechar modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUser(null);
  }, []);

  // Salvar alterações do usuário
  const handleSaveUser = useCallback(
    async (perfil: Perfil, status: Status) => {
      if (!selectedUser) return;

      const updatedUser = { ...selectedUser, perfil, status };
      await setUser(updatedUser); // Atualiza mock global
      await fetchUsers(); // Atualiza lista local
      handleCloseModal();
    },
    [selectedUser, fetchUsers, handleCloseModal]
  );

  // Filtrar usuários
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchSearch =
        user.nome.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());
      const matchPerfil = perfilFilter ? user.perfil === perfilFilter : true;
      const matchStatus = statusFilter ? user.status === statusFilter : true;
      return matchSearch && matchPerfil && matchStatus;
    });
  }, [users, search, perfilFilter, statusFilter]);

  return {
    users: filteredUsers,
    search,
    setSearch,
    perfilFilter,
    setPerfilFilter,
    statusFilter,
    setStatusFilter,
    isModalOpen,
    selectedUser,
    handleOpenModal,
    handleCloseModal,
    handleSaveUser,
  };
};
