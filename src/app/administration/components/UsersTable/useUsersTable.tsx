"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { getUsers, setUser } from "../../services/usersService";
import { User, Perfil, Status } from "../../schema/usersSchema";

const DEFAULT_PAGE_SIZE = 8;

export const useUsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [perfilFilter, setPerfilFilter] = useState<Perfil | "">("");
  const [statusFilter, setStatusFilter] = useState<Status | "">("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);

  const fetchUsers = useCallback(async () => {
    const data = await getUsers();
    setUsers(data);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenModal = useCallback((user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedUser(null);
  }, []);

  const handleSaveUser = useCallback(
    async (perfil: Perfil, status: Status) => {
      if (!selectedUser) return;

      const updatedUser = { ...selectedUser, perfil, status };
      await setUser(updatedUser);
      await fetchUsers();
      handleCloseModal();
    },
    [selectedUser, fetchUsers, handleCloseModal]
  );

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return users.filter((user) => {
      const matchSearch = normalizedSearch
        ? user.nome.toLowerCase().includes(normalizedSearch) ||
          user.email.toLowerCase().includes(normalizedSearch)
        : true;
      const matchPerfil = perfilFilter ? user.perfil === perfilFilter : true;
      const matchStatus = statusFilter ? user.status === statusFilter : true;
      return matchSearch && matchPerfil && matchStatus;
    });
  }, [users, search, perfilFilter, statusFilter]);

  useEffect(() => {
    setPage(1);
  }, [search, perfilFilter, statusFilter, pageSize]);

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
    setPerfilFilter("");
    setStatusFilter("");
    setPage(1);
    setPageSize(DEFAULT_PAGE_SIZE);
  }, []);

  return {
    users: paginatedUsers,
    totalFiltered,
    totalPages,
    currentPage,
    pageSize,
    setPageSize,
    goToPage,
    search,
    setSearch,
    perfilFilter,
    setPerfilFilter,
    statusFilter,
    setStatusFilter,
    resetFilters,
    isModalOpen,
    selectedUser,
    handleOpenModal,
    handleCloseModal,
    handleSaveUser,
  };
};
