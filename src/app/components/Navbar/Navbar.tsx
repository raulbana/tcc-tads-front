"use client";

import React from "react";
import { useNavbar } from "./useNavbar";
import NavItem from "./components/NavItem";
import SidebarToggler from "./components/SidebarToggler";
import Button from "@/app/components/Button/Button";
import { usePathname } from "next/navigation";
import DailyIULogo from "@/app/assets/illustrations/daily-iu-logo.svg";


interface NavbarProps {
  children?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const {
    isOpen,
    toggle,
    navItems,
    isLogged,
    username,
    logout,
  } = useNavbar();

  const pathname = usePathname();

  if (!isLogged) {
    return <>{children}</>;
  }

  const getActiveItem = () => {
    return navItems.find(item => pathname === item.link)?.name || "";
  };

  return (
    <div className="flex flex-col h-screen bg-gray-01">
      <nav className="bg-white border-b-2 border-gray-03 h-16 flex items-center justify-between px-4 shadow-sm relative z-50">
        <div className="flex items-center gap-4">
          <SidebarToggler onClick={toggle} isToggled={isOpen} />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8">
              <DailyIULogo className="w-full h-full" />
            </div>
            <span className="font-semibold text-gray-08 text-lg">DailyIU</span>
          </div>
        </div>

        {!isOpen && (
          <div className="hidden md:flex h-full items-center flex-1 justify-center">
            <ul className="flex items-center gap-2">
              {navItems.map((item, index) => 
                item.enabled && (
                  <NavItem 
                    key={`${item.name}-${index}`} 
                    {...item} 
                    isActive={pathname === item.link}
                  />
                )
              )}
            </ul>
          </div>
        )}

        {!isOpen && (
          <div className="hidden md:flex items-center gap-4">
            <div className="flex flex-col items-end">
              <span className="text-sm text-gray-08 font-medium">
                Olá, {username}!
              </span>
              <span className="text-xs text-gray-06">
                Bem-vinda ao DailyIU
              </span>
            </div>
            <div className="w-8 h-8 bg-purple-04 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {username?.charAt(0) || "U"}
              </span>
            </div>
          </div>
        )}
      </nav>

      <div className="relative flex flex-1 overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 bg-white border-r-2 border-gray-03 shadow-lg transition-transform duration-300 ease-in-out z-40 ${
            isOpen ? "w-full sm:w-80 translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-gray-03">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-04 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {username?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-08">
                    Olá, {username}!
                  </span>
                  <span className="text-sm text-gray-06">
                    Bem-vinda ao DailyIU
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 py-6 px-4">
              <ul className="flex flex-col gap-2">
                {navItems.map((item, index) => 
                  item.enabled && (
                    <NavItem 
                      key={`sidebar-${item.name}-${index}`} 
                      {...item} 
                      sidebar={true}
                      isActive={pathname === item.link}
                    />
                  )
                )}
              </ul>
            </div>

            <div className="p-4 border-t border-gray-03">
              <Button
                text="Sair"
                type="SECONDARY"
                onClick={logout}
                className="w-full"
              />
            </div>
          </div>
        </div>

        {isOpen && (
          <div
            className="absolute inset-0 bg-black/20 z-30 sm:hidden"
            onClick={toggle}
          />
        )}

        <main
          className={`transition-all duration-300 ease-in-out flex-1 overflow-y-auto bg-gray-02 ${
            isOpen ? "sm:ml-80" : "ml-0"
          }`}
        >
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Navbar;