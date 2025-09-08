"use client";
import React from "react";
import Calendar from "./components/Calendar/Calendar";
import ReportCard from "./components/ReportCard/ReportCard";
import Navbar from "@/app/components/Navbar/Navbar";

const DiaryPage = () => {
  return (
    <Navbar>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Diário Miccional</h1>
            <p className="text-gray-600 mt-2">
              Acompanhe seus eventos e progresso diário
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <Calendar />
          </div>

          <ReportCard />
        </div>
      </div>
    </Navbar>
  );
};

export default DiaryPage;