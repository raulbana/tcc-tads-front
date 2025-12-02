"use client";
import React from "react";
import UsersTable from "../components/UsersTable/UsersTable";
import AdminRoute from "@/app/components/ProtectedRoute/AdminRoute";

const AdminUsers = () => {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Administração de Usuários
            </h1>
            <p className="text-gray-600 mt-2">
              Gerencie os usuários do DailyUI
            </p>
          </div>

          <UsersTable />
        </div>
      </div>
    </AdminRoute>
  );
};

export default AdminUsers;
