"use client";

import React from "react";

interface SidebarTogglerProps {
  onClick: () => void;
  isToggled: boolean;
}

const SidebarToggler: React.FC<SidebarTogglerProps> = ({
  onClick,
  isToggled,
}) => {
  return (
    <button
      onClick={onClick}
      aria-label="Toggle navigation menu"
      aria-expanded={isToggled}
      className="relative w-6 h-6 cursor-pointer focus:outline-none"
    >
      <span
        className={`absolute left-0 top-1/2 block h-0.5 w-full rounded bg-purple-04 origin-center transition-all duration-300 ease-in-out
          ${isToggled ? "rotate-45 translate-y-0" : "-translate-y-2 rotate-0"}`}
      />
      <span
        className={`absolute left-0 top-1/2 block h-0.5 w-full rounded bg-purple-04 origin-center transition-all duration-200 ease-in-out
          ${isToggled ? "opacity-0" : "opacity-100"}`}
      />
      <span
        className={`absolute left-0 top-1/2 block h-0.5 w-full rounded bg-purple-04 origin-center transition-all duration-300 ease-in-out
          ${isToggled ? "-rotate-45 translate-y-0" : "translate-y-2 rotate-0"}`}
      />
    </button>
  );
};

export default SidebarToggler;
