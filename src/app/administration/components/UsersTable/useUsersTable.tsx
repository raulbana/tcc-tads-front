"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { getUsers, setUserRole, setUserStatus } from "../../services/usersService";
import { User, Status } from "../../schema/usersSchema";
import { AxiosError } from "axios";

const DEFAULT_PAGE_SIZE = 8;

export const useUsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<number | "">("");
  const [statusFilter, setStatusFilter] = useState<Status | "">("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [modalOperation, setModalOperation] = useState<'setStatus' | 'setRole' | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Buscar usuários do service
  const fetchUsers = useCallback(async () => {
    try {
      setError(null);
      const data = await getUsers();
      setUsers(data);
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || "Erro ao buscar usuários.");
      } else {
        setError(String(error) || "Erro ao buscar usuários.");
      }
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Abrir modal com usuário selecionado
  const handleOpenModal = useCallback((operation: 'setStatus' | 'setRole', user: User) => {
    setSelectedUser(user);
    setModalOperation(operation);
    setIsModalOpen(true);
  }, []);

  // Fechar modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUser(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Salvar alterações do usuário
  const handleSaveUser = useCallback(
    async (user: User) => {
      if (!selectedUser) return;
      if(modalOperation === null) return;

      try {
        setError(null);
        if(modalOperation === 'setStatus') {
          user.status = selectedUser.status === "Ativo" ? "Bloqueado" : "Ativo";
          await setUserStatus(user.id, user.status);
        } else if(modalOperation === 'setRole') {
          await setUserRole(user);
        }

        await fetchUsers();
        handleCloseModal();
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          setError(error.response?.data?.message || "Erro ao salvar alterações do usuário.");
          return;
        } else {
          setError(String(error) || "Erro ao salvar alterações do usuário.");
          return;
        }
      }
    },
    [selectedUser, fetchUsers, handleCloseModal, modalOperation]
  );

  // Filtrar usuários
  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchSearch = normalizedSearch
        ? user.name.toLowerCase().includes(normalizedSearch) ||
          user.email.toLowerCase().includes(normalizedSearch)
        : true;
      const matchRole = roleFilter ? user.role.permissionLevel === roleFilter : true;
      const matchStatus = statusFilter ? user.status === statusFilter : true;
      return matchSearch && matchRole && matchStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, roleFilter, statusFilter, pageSize]);
  const totalFiltered = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));
  const currentPage = Math.min(page, totalPages);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredUsers.slice(startIndex, startIndex + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  const goToPage = useCallback(
    (target: number) => {
      if (target < 1 || target > totalPages) return;
      setPage(target);
    },
    [totalPages]
  );

  const resetFilters = useCallback(() => {
    setSearch("");
    setRoleFilter("");
    setStatusFilter("");
    setPage(1);
    setPageSize(DEFAULT_PAGE_SIZE);
  }, []);

  return {
    users: paginatedUsers,
    totalPages,
    currentPage,
    pageSize,
    setPageSize,
    goToPage,
    search,
    setSearch,
    roleFilter,
    setRoleFilter,
    statusFilter,
    setStatusFilter,
    resetFilters,
    isModalOpen,
    selectedUser,
    setSelectedUser,
    handleOpenModal,
    handleCloseModal,
    handleSaveUser,
    modalOperation,
    error,
    clearError,
  };
};
