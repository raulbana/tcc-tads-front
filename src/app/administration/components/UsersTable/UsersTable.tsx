import React, { useMemo } from "react";
import { useUsersTable } from "./useUsersTable";
import { Status } from "../../schema/usersSchema";
import { userRoles } from "@/app/types/auth";
import Toast from "@/app/components/Toast/Toast";

const pageSizeOptions = [5, 8, 12, 20];

const UsersTable = () => {
  const {
    users,
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
  } = useUsersTable();

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
              value={roleFilter}
              onChange={(e) => setRoleFilter(+e.target.value || "")}
              className="p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 w-40"
            >
              <option value="">Todos</option>
              <option value={userRoles.USER.permissionLevel}>{userRoles.USER.description}</option>
              <option value={userRoles.PROFESSIONAL.permissionLevel}>{userRoles.PROFESSIONAL.description}</option>
              <option value={userRoles.ADMIN.permissionLevel}>{userRoles.ADMIN.description}</option>
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
        </div>
      </div>
      <button
        onClick={resetFilters}
        className="self-end px-4 py-2 text-sm font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-xl transition cursor-pointer"
      >
        Limpar filtros
      </button>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
        <div className="flex flex-wrap gap-2 items-center"></div>
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
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.role.description}</td>
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
                  <td className="p-3 text-center flex justify-end gap-2">
                    <button
                      className="px-3 py-2 min-w-[90px] text-xs font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-lg transition cursor-pointer"
                      title="Gerenciar perfil"
                      onClick={() => handleOpenModal("setRole", user)}
                    >
                      Perfil
                    </button>
                    <button
                      className="px-3 py-2 min-w-[90px] text-xs font-medium text-purple-700 bg-purple-100 hover:bg-purple-200 rounded-lg transition cursor-pointer"
                      title={
                        user.status === "Ativo"
                          ? "Bloquear usuário"
                          : "Desbloquear usuário"
                      }
                      onClick={() => handleOpenModal("setStatus", user)}
                    >
                      {user.status === "Ativo" ? (
                        "Bloquear"
                      ) : (
                        "Desbloquear"
                      )}
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

            {modalOperation === "setStatus" && (
              <div className="p-4">
                <p>
                  Deseja{" "}
                  {selectedUser.status === "Ativo" ? "bloquear" : "desbloquear"}{" "}
                  o usuário {`"${selectedUser.name}"`}?
                </p>
              </div>
            )}

            {modalOperation === "setRole" && (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Perfil
                  </label>
                  <select
                    value={selectedUser.role.permissionLevel}
                    onChange={(e) => setSelectedUser({
                      ...selectedUser,
                      role: {
                        ...selectedUser.role,
                        permissionLevel: Number(e.target.value),
                      },
                    })}
                    className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                  >
                    <option value={userRoles.USER.permissionLevel}>{userRoles.USER.description}</option>
                    <option value={userRoles.PROFESSIONAL.permissionLevel}>{userRoles.PROFESSIONAL.description}</option>
                    <option value={userRoles.ADMIN.permissionLevel}>{userRoles.ADMIN.description}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Motivo
                  </label>
                  <input
                    type="text"
                    placeholder="Motivo da alteração de perfil"
                    value={selectedUser.role.reason}
                    onChange={(e) => {
                      if (selectedUser) {
                        setSelectedUser({
                          ...selectedUser,
                          role: {
                            ...selectedUser.role,
                            reason: e.target.value,
                          },
                        });
                      }
                    }}
                    className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Tipo do documento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: CREFITO, CRM..."
                    value={selectedUser.role.documentType || ""}
                    onChange={(e) => {
                      if (selectedUser) {
                        setSelectedUser({
                          ...selectedUser,
                          role: {
                            ...selectedUser.role,
                            documentType: e.target.value.toUpperCase(),
                          },
                        });
                      }
                    }}
                    className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Documento <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Informe o número do documento..."
                    value={selectedUser.role.documentValue || ""}
                    onChange={(e) => {
                      if (selectedUser) {
                        setSelectedUser({
                          ...selectedUser,
                          role: {
                            ...selectedUser.role,
                            documentValue: e.target.value,
                          },
                        });
                      }
                    }}
                    className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                onClick={() => handleSaveUser(selectedUser)}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition cursor-pointer"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
      {error && (
          <Toast
            type="ERROR"
            message={error}
            isOpen={!!error}
            onClose={clearError}
            duration={5000}
          />
        )}
      {success && (
          <Toast
            type="SUCCESS"
            message={success}
            isOpen={!!success}
            onClose={clearSuccess}
            duration={5000}
          />
        )}
    </div>
  );
};

export default UsersTable;
