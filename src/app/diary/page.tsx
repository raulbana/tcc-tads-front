"use client";
import React from "react";
import Calendar from "./components/Calendar/Calendar";
import ReportCard from "./components/ReportCard/ReportCard";
import DayDetails from "./components/DayDetails/DayDetails";
import DayDataModal from "./components/DayDataModal/DayDataModal";
import { useDiaryPage } from "./components/DayDetails/useDayDetails";

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
  } = useDiaryPage();

  return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Diário Miccional</h1>
            <p className="text-gray-600 mt-2">
              Acompanhe seus eventos e progresso diário
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <Calendar
                selectedDay={selectedDay || undefined}
                onDaySelect={handleDaySelect}
              />
              <ReportCard />
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              {selectedDay ? (
                <DayDetails
                  selectedDay={selectedDay}
                  onAddRecord={handleAddRecord}
                  onEditRecord={handleEditRecord}
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
      </div>
  );
};

export default DiaryPage;