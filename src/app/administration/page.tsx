import React from "react";
import Link from "next/link";
import AdminRoute from "../components/ProtectedRoute/AdminRoute";

const Administration = () => {
  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Painel de Administração
        </h1>
        <p className="text-gray-600 mb-8 text-center">
          Acesse os diferentes painéis de administração abaixo
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <Link href="/administration/adminUsers">
            <button className="w-64 p-4 bg-purple-500 text-white rounded-2xl hover:bg-purple-700 transition">
              Painel de Usuários
            </button>
          </Link>

          <Link href="/administration/adminComplaints">
            <button className="w-64 p-4 bg-purple-500 text-white rounded-2xl hover:bg-purple-700 transition">
              Painel de Denúncias
            </button>
          </Link>

          <Link href="/administration/adminExercises">
            <button className="w-64 p-4 bg-purple-500 text-white rounded-2xl hover:bg-purple-700 transition">
              Painel de Exercícios
            </button>
          </Link>

          <Link href="/administration/adminWorkouts">
            <button className="w-64 p-4 bg-purple-500 text-white rounded-2xl hover:bg-purple-700 transition">
              Treinos
            </button>
          </Link>

          <Link href="/administration/adminWorkoutPlans">
            <button className="w-64 p-4 bg-purple-500 text-white rounded-2xl hover:bg-purple-700 transition">
              Plano de Treino
            </button>
          </Link>

          <Link href="/administration/adminContentCategories">
            <button className="w-64 p-4 bg-purple-500 text-white rounded-2xl hover:bg-purple-700 transition">
              Categorias de Publicação
            </button>
          </Link>
        </div>
      </div>
    </AdminRoute>
  );
};

export default Administration;
