"use client";

import React from "react";

interface SidebarTogglerProps {
  onClick: () => void;
  isToggled: boolean;
}

const SidebarToggler: React.FC<SidebarTogglerProps> = ({ onClick, isToggled }) => {
  return (
    <button
      onClick={onClick}
      className="relative flex flex-col justify-between w-6 h-5 cursor-pointer focus:outline-none transition-all duration-300 ease-in-out"
      aria-label="Toggle navigation menu"
    >
      <div
        className={`w-full h-0.5 bg-purple-04 rounded transform transition-all duration-300 ease-in-out ${
          isToggled ? "rotate-45 translate-y-2" : "rotate-0 translate-y-0"
        }`}
      />
      <div
        className={`w-full h-0.5 bg-purple-04 rounded transition-all duration-300 ease-in-out ${
          isToggled ? "opacity-0" : "opacity-100"
        }`}
      />
      <div
        className={`w-full h-0.5 bg-purple-04 rounded transform transition-all duration-300 ease-in-out ${
          isToggled ? "-rotate-45 -translate-y-2.5" : "rotate-0 translate-y-0"
        }`}
      />
    </button>
  );
};

export default SidebarToggler;