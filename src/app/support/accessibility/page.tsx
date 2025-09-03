"use client";

import React, { useState } from "react";
import AccessibilityModal from "./components/accessibilityModal/accessibilityModal";

const Accessibility = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-purple-04 text-gray-01 rounded-lg"
      >
        Abrir Modal de Acessibilidade
      </button>
      <br />
      <br />
      <div> PÁGINA APENAS PARA TESTE DE MODAL: EXCLUIR FUTURAMENTE </div>
      <AccessibilityModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

export default Accessibility;
