"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState, useMemo } from "react";
import { useAuth } from "@/app/contexts/AuthContext";

interface NavItem {
  name: string;
  link: string;
  enabled: boolean;
}

export const useNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAccessibilityOpen, setAccessibilityOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const router = useRouter();
  const pathname = usePathname();

  const toggle = () => setIsOpen(!isOpen);

  const authenticatedNavItems: NavItem[] = useMemo(
    () => [
      { name: "Início", link: "/", enabled: true },
      { name: "Diário", link: "/diary", enabled: true },
      { name: "Exercícios", link: "/exercises", enabled: true },
      { name: "Conteúdos", link: "/contents", enabled: true },
      { name: "Sobre", link: "/about", enabled: true },
      { name: "Contato", link: "/support/talkToUs", enabled: true },
      { name: "Administração", link: "/administration", enabled: true },
    ],
    []
  );

  const publicNavItems: NavItem[] = useMemo(
    () => [
      { name: "Sobre", link: "/about", enabled: true },
      { name: "Contato", link: "/support/talkToUs", enabled: true },
    ],
    []
  );

  const currentNavItems = useMemo(() => {
    return isAuthenticated ? authenticatedNavItems : publicNavItems;
  }, [isAuthenticated, authenticatedNavItems, publicNavItems]);

  const isActiveItem = (link: string): boolean => pathname === link;

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/");
  };

  const closeSidebar = () => setIsOpen(false);

  const goToLogin = () => router.push("/authentication/login");
  const goToRegister = () => router.push("/authentication/register");

  return {
    isOpen,
    authState: {
      isLogged: isAuthenticated,
      username: user?.name,
    },
    user,
    currentNavItems,
    pathname,
    toggle,
    closeSidebar,
    logout: handleLogout,
    isActiveItem,
    goToLogin,
    goToRegister,
    isAccessibilityOpen,
    setAccessibilityOpen,
  };
};

export type { NavItem, AuthState };
