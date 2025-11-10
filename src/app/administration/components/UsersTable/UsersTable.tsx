import React, { useState, useEffect, useMemo } from "react";
import { PencilSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import { useUsersTable } from "./useUsersTable";
import { Perfil, Status } from "../../schema/usersSchema";

const pageSizeOptions = [5, 8, 12, 20];

const UsersTable = () => {
  const {
    users,
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
  } = useUsersTable();

  const [editPerfil, setEditPerfil] = useState<Perfil>("Usuário");
  const [editStatus, setEditStatus] = useState<Status>("Ativo");

  useEffect(() => {
    if (selectedUser) {
      setEditPerfil(selectedUser.perfil);
      setEditStatus(selectedUser.status);
    }
  }, [selectedUser]);

  const pageNumbers = useMemo(() => {
    const range: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;
    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }, [currentPage, totalPages]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-2 w-full xl:max-w-xl">
          <label className="block text-sm font-medium text-gray-700">
            Pesquisar usuários
          </label>
          <input
            type="text"
            placeholder="Nome ou e-mail"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>
        <div className="flex flex-wrap gap-3 w-full xl:justify-end">
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Perfil
            </label>
            <select
              value={perfilFilter}
              onChange={(e) => setPerfilFilter(e.target.value as Perfil | "")}
              className="p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 w-40"
            >
              <option value="">Todos</option>
              <option value="Usuário">Usuário</option>
              <option value="Saúde">Saúde</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as Status | "")}
              className="p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 w-40"
            >
              <option value="">Todos</option>
              <option value="Ativo">Ativo</option>
              <option value="Bloqueado">Bloqueado</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Resultados por página
            </label>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 w-32"
            >
              {pageSizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={resetFilters}
            className="self-end px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-xl transition cursor-pointer"
          >
            Limpar filtros
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
        <div className="flex flex-wrap gap-2 items-center">
          <span>
            Mostrando {users.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} -
            {Math.min(currentPage * pageSize, totalFiltered)} de {totalFiltered}
          </span>
          {perfilFilter && (
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              Perfil: {perfilFilter}
            </span>
          )}
          {statusFilter && (
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              Status: {statusFilter}
            </span>
          )}
          {search.trim() && (
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
              Busca: "{search.trim()}"
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 disabled:bg-purple-50 disabled:text-purple-300 rounded-lg transition cursor-pointer"
          >
            Anterior
          </button>
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition cursor-pointer ${
                currentPage === page
                  ? "bg-purple-600 text-white"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-200"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-xs font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 disabled:bg-purple-50 disabled:text-purple-300 rounded-lg transition cursor-pointer"
          >
            Próximo
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-purple-200 text-left text-sm font-semibold text-gray-700">
              <th className="p-3 rounded-l-lg">Nome</th>
              <th className="p-3">E-mail</th>
              <th className="p-3">Perfil</th>
              <th className="p-3">Status</th>
              <th className="p-3 rounded-r-lg text-center">Editar</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t hover:bg-purple-50 transition"
                >
                  <td className="p-3">{user.nome}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.perfil}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded-lg text-sm font-medium ${
                        user.status === "Ativo"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 transition cursor-pointer"
                      title="Editar usuário"
                      onClick={() => handleOpenModal(user)}
                    >
                      <PencilSimpleIcon size={18} className="text-purple-600" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg space-y-4">
            <h2 className="text-xl font-bold text-gray-800">Editar Usuário</h2>
            <p className="text-gray-600">{selectedUser.nome}</p>
            <p className="text-gray-600">{selectedUser.email}</p>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Perfil
                </label>
                <select
                  value={editPerfil}
                  onChange={(e) => setEditPerfil(e.target.value as Perfil)}
                  className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="Usuário">Usuário</option>
                  <option value="Saúde">Saúde</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as Status)}
                  className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Bloqueado">Bloqueado</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleSaveUser(editPerfil, editStatus)}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition cursor-pointer"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersTable;
