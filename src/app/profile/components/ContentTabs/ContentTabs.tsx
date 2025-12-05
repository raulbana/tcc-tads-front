"use client";

import React from "react";

export type ContentTab = "saved" | "own";

export interface ContentTabsProps {
  activeTab: ContentTab;
  onTabChange: (tab: ContentTab) => void;
}

const ContentTabs: React.FC<ContentTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="flex gap-2 border-b border-gray-200">
      <button
        onClick={() => onTabChange("saved")}
        className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
          activeTab === "saved"
            ? "text-purple-600 border-purple-600"
            : "text-gray-600 border-transparent hover:text-gray-800"
        }`}
      >
        Conteúdos Salvos
      </button>
      <button
        onClick={() => onTabChange("own")}
        className={`px-6 py-3 font-semibold transition-colors border-b-2 ${
          activeTab === "own"
            ? "text-purple-600 border-purple-600"
            : "text-gray-600 border-transparent hover:text-gray-800"
        }`}
      >
        Meus Conteúdos
      </button>
    </div>
  );
};

export default ContentTabs;






