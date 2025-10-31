import React, { useState, useEffect } from "react";
import { PencilSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import { useUsersTable } from "./useUsersTable";
import { Perfil, Status } from "../../schema/usersSchema";

const UsersTable = () => {
  const {
    users,
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
  } = useUsersTable();

  const [editPerfil, setEditPerfil] = useState<Perfil>("Usuário");
  const [editStatus, setEditStatus] = useState<Status>("Ativo");

  useEffect(() => {
    if (selectedUser) {
      setEditPerfil(selectedUser.perfil);
      setEditStatus(selectedUser.status);
    }
  }, [selectedUser]);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
      {/* 🔍 Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <input
          type="text"
          placeholder="Pesquisar por nome ou e-mail..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-1/3 p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <div className="flex gap-3">
          <select
            value={perfilFilter}
            onChange={(e) => setPerfilFilter(e.target.value as Perfil | "")}
            className="p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 w-full sm:w-40"
          >
            <option value="">Todos os Perfis</option>
            <option value="Usuário">Usuário</option>
            <option value="Saúde">Saúde</option>
            <option value="Admin">Admin</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as Status | "")}
            className="p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 w-full sm:w-40"
          >
            <option value="">Todos os Status</option>
            <option value="Ativo">Ativo</option>
            <option value="Bloqueado">Bloqueado</option>
          </select>
        </div>
      </div>

      {/* 🧾 Tabela */}
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
                      className="p-2 rounded-xl bg-purple-100 hover:bg-purple-200 transition"
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

      {/* 🟣 Modal */}
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
                className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleSaveUser(editPerfil, editStatus)}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition"
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
