"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  getUsers,
  setUserRole,
  setUserStatus,
} from "../../services/usersService";
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
  const [modalOperation, setModalOperation] = useState<
    "setStatus" | "setRole" | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

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
  const handleOpenModal = useCallback(
    (operation: "setStatus" | "setRole", user: User) => {
      setSelectedUser(user);
      setModalOperation(operation);
      setIsModalOpen(true);
    },
    []
  );

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setModalOperation(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSuccess = useCallback(() => {
    setSuccess(null);
  }, []);

  const handleSaveUser = useCallback(
    async (user: User) => {
      if (!selectedUser || !modalOperation) return;

      try {
        setError(null);
        if (modalOperation === "setRole") {
          await setUserRole(selectedUser.id, user.role);
          setSuccess("Perfil do usuário atualizado com sucesso!");
        } else if (modalOperation === "setStatus") {
          await setUserStatus(selectedUser.id, user.status);
          setSuccess("Status do usuário atualizado com sucesso!");
        }
        await fetchUsers();
        handleCloseModal();
      } catch (error: unknown) {
        if (error instanceof AxiosError) {
          setError(
            error.response?.data?.message || "Erro ao atualizar usuário."
          );
        } else {
          setError(String(error) || "Erro ao atualizar usuário.");
        }
      }
    },
    [selectedUser, modalOperation, fetchUsers, handleCloseModal]
  );

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchSearch = normalizedSearch
        ? user.name.toLowerCase().includes(normalizedSearch) ||
          user.email.toLowerCase().includes(normalizedSearch)
        : true;
      const matchRole = roleFilter
        ? user.role.permissionLevel === roleFilter
        : true;
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
    success,
    clearSuccess,
  };
};
