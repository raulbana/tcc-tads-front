"use client";
import React from "react";
import Calendar from "./components/Calendar/Calendar";
import ReportCard from "./components/ReportCard/ReportCard";
import DayDetails from "./components/DayDetails/DayDetails";
import DayDataModal from "./components/DayDataModal/DayDataModal";
import { useDiaryPage } from "./components/DayDetails/useDayDetails";
import { useDiary } from "@/app/contexts/DiaryContext";
import Toast from "@/app/components/Toast/Toast";

const DiaryPage = () => {
  const {
    selectedDay,
    handleDaySelect,
    handleAddRecord,
    handleEditRecord,
    isAddModalOpen,
    isEditModalOpen,
    editingRecord,
    handleCloseAddModal,
    handleCloseEditModal,
    handleSubmitNewRecord,
    handleSubmitEditRecord,
    handleDeleteRecord,
    handleUpdateLeakage,
    handleUpdateNotes,
  } = useDiaryPage();

  const { isLoading, error, clearError } = useDiary();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {error && (
          <Toast
            type="ERROR"
            message={error}
            isOpen={!!error}
            onClose={clearError}
            duration={5000}
          />
        )}

        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Diário Miccional</h1>
          <p className="text-gray-600 mt-2">
            Acompanhe seus eventos e progresso diário
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="mb-8">
              <Calendar
                selectedDay={selectedDay || undefined}
                onDaySelect={handleDaySelect}
              />
            </div>
            <ReportCard />
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            {selectedDay ? (
              <DayDetails
                selectedDay={selectedDay}
                onAddRecord={handleAddRecord}
                onEditRecord={handleEditRecord}
                onDeleteRecord={handleDeleteRecord}
                onUpdateLeakage={handleUpdateLeakage}
                onUpdateNotes={handleUpdateNotes}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      <DayDataModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        onSubmit={handleSubmitNewRecord}
        title="Novo Registro"
        baseDate={selectedDay?.date}
      />

      <DayDataModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        onSubmit={handleSubmitEditRecord}
        title="Editar Registro"
        selectedValues={editingRecord?.record}
        baseDate={selectedDay?.date}
      />

      {isLoading && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
        </div>
      )}
    </div>
  );
};

export default DiaryPage;
