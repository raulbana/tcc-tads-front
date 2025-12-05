"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useNavbar } from "./useNavbar";
import Button from "@/app/components/Button/Button";
import AccessibilityModal from "@/app/support/accessibility/components/accessibilityModal/accessibilityModal";
import NavItem from "./components/NavItem";
import SidebarToggler from "./components/SidebarToggler";
import { PersonArmsSpreadIcon } from "@phosphor-icons/react";

import DailyIULogo from "@/app/assets/illustrations/daily-iu-logo.svg";

interface NavbarProps {
  children?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const {
    isOpen,
    authState,
    currentNavItems,
    toggle,
    closeSidebar,
    logout,
    isActiveItem,
    goToLogin,
    goToRegister,
    isAccessibilityOpen,
    setAccessibilityOpen,
  } = useNavbar();

  const renderDesktopNavItems = () => (
    <div className="hidden md:flex h-full items-center flex-1 justify-center">
      <ul className="flex items-center gap-2">
        {currentNavItems.map(
          (item, index) =>
            item.enabled && (
              <NavItem
                key={`${item.name}-${index}`}
                {...item}
                isActive={isActiveItem(item.link)}
              />
            )
        )}
      </ul>
    </div>
  );

  const renderAuthenticatedUserInfo = () => {
    const hasProfilePicture =
      authState.user?.profilePictureUrl &&
      authState.user.profilePictureUrl.trim() !== "";

    return (
      <Link
        href="/profile"
        className="hidden md:flex items-center gap-4 hover:opacity-80 transition-opacity"
      >
        <div className="flex flex-col items-end">
          <span className="text-sm text-gray-08 font-medium">
            Olá, {authState.username}!
          </span>
          <span className="text-xs text-gray-06">Bem-vinda ao DailyIU</span>
        </div>
        <div className="relative w-8 h-8 bg-purple-04 rounded-full flex items-center justify-center overflow-hidden">
          {hasProfilePicture ? (
            <Image
              src={authState.user.profilePictureUrl}
              alt={authState.username || "Usuário"}
              fill
              className="object-cover rounded-full"
              sizes="32px"
              unoptimized={authState.user.profilePictureUrl?.startsWith(
                "data:"
              )}
            />
          ) : (
            <span className="text-white font-medium text-sm">
              {authState.username?.charAt(0) || "U"}
            </span>
          )}
        </div>
      </Link>
    );
  };

  const renderPublicAuthButtons = () => (
    <div className="hidden md:flex items-center gap-3">
      <Button
        type="SECONDARY"
        text="Entrar"
        className="px-4 py-2"
        onClick={goToLogin}
      />
      <Button
        type="PRIMARY"
        text="Cadastrar"
        className="px-4 py-2"
        onClick={goToRegister}
      />
    </div>
  );

  const renderSidebarHeader = () => {
    const hasProfilePicture =
      authState.user?.profilePictureUrl &&
      authState.user.profilePictureUrl.trim() !== "";

    return (
      <div className="flex items-center justify-between p-4 border-b border-gray-03">
        {authState.isLogged ? (
          <Link
            href="/profile"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="relative w-10 h-10 bg-purple-04 rounded-full flex items-center justify-center overflow-hidden">
              {hasProfilePicture ? (
                <Image
                  src={authState.user.profilePictureUrl}
                  alt={authState.username || "Usuário"}
                  fill
                  className="object-cover rounded-full"
                  sizes="40px"
                  unoptimized={authState.user.profilePictureUrl?.startsWith(
                    "data:"
                  )}
                />
              ) : (
                <span className="text-white font-medium">
                  {authState.username?.charAt(0) || "U"}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-gray-08">
                Olá, {authState.username}!
              </span>
              <span className="text-sm text-gray-06">Bem-vinda ao DailyIU</span>
            </div>
          </Link>
        ) : (
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10">
              <DailyIULogo className="w-full h-full" />
            </div>
            <span className="font-semibold text-gray-08 text-xl">DailyIU</span>
          </Link>
        )}
      </div>
    );
  };

  const renderSidebarNavItems = () => (
    <div className="flex-1 py-6 px-4">
      <ul className="flex flex-col gap-2">
        {currentNavItems.map(
          (item, index) =>
            item.enabled && (
              <NavItem
                key={`sidebar-${item.name}-${index}`}
                {...item}
                sidebar={true}
                isActive={isActiveItem(item.link)}
              />
            )
        )}
      </ul>
    </div>
  );

  const renderSidebarFooter = () => (
    <div className="p-4 border-t border-gray-03">
      {authState.isLogged ? (
        <Button
          text="Sair"
          type="SECONDARY"
          onClick={logout}
          className="w-full"
        />
      ) : (
        <div className="space-y-3">
          <Button
            type="SECONDARY"
            text="Entrar"
            className="w-full"
            onClick={goToLogin}
          />
          <Button
            type="PRIMARY"
            text="Cadastrar"
            className="w-full"
            onClick={goToRegister}
          />
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-01">
      <nav className="bg-white border-b-2 border-gray-03 h-16 flex items-center justify-between px-4 shadow-sm relative z-50">
        <div className="flex items-center gap-4">
          <SidebarToggler onClick={toggle} isToggled={isOpen} />
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8">
              <DailyIULogo className="w-full h-full" />
            </div>
            <span className="font-semibold text-gray-08 text-lg">DailyIU</span>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {!isOpen && renderDesktopNavItems()}

          {authState.isLogged && (
            <Button
              className="w-8 h-8"
              onClick={() => setAccessibilityOpen(true)}
              size="SMALL"
              aria-label="Abrir configurações de acessibilidade"
              icon={
                <PersonArmsSpreadIcon weight="fill" className="text-white" />
              }
              iconPosition="CENTER"
            />
          )}
        </div>

        {!isOpen &&
          (authState.isLogged
            ? renderAuthenticatedUserInfo()
            : renderPublicAuthButtons())}
      </nav>

      <AccessibilityModal
        isOpen={isAccessibilityOpen}
        onClose={() => setAccessibilityOpen(false)}
      />

      <div className="relative flex flex-1 overflow-hidden">
        <div
          className={`absolute inset-y-0 left-0 bg-white border-r-2 border-gray-03 shadow-lg transition-transform duration-300 ease-in-out z-40 ${
            isOpen ? "w-full sm:w-80 translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {renderSidebarHeader()}
            {renderSidebarNavItems()}
            {renderSidebarFooter()}
          </div>
        </div>

        {isOpen && (
          <div
            className="absolute inset-0 bg-black/20 z-30 sm:hidden"
            onClick={closeSidebar}
          />
        )}

        <main
          className={`transition-all duration-300 ease-in-out flex-1 overflow-y-auto bg-gray-02 ${
            isOpen ? "sm:ml-80" : "ml-0"
          }`}
        >
          <div className="min-h-full">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default Navbar;
