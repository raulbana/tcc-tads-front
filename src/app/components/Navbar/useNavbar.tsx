"use client";
import { useRouter, usePathname } from "next/navigation";
import { useState, useMemo } from "react";

interface NavItem {
  name: string;
  link: string;
  enabled: boolean;
}

interface AuthState {
  isLogged: boolean;
  username?: string;
}

const useNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authState, setAuthState] = useState<AuthState>({
    isLogged: true,
    username: "Maria",
  });

  const router = useRouter();
  const pathname = usePathname();

  const toggle = () => setIsOpen(!isOpen);

  const authenticatedNavItems: NavItem[] = useMemo(() => [
    { name: "Início", link: "/", enabled: true },
    { name: "Diário", link: "/diary", enabled: true },
    { name: "Exercícios", link: "/exercises", enabled: true },
    { name: "Conteúdos", link: "/contents", enabled: true },
    { name: "Relatórios", link: "/reports", enabled: true },
    { name: "Perfil", link: "/profile", enabled: true },
    { name: "Sobre", link: "/about", enabled: true },
    { name: "Contato", link: "/contact", enabled: true },
  ], []);

  const publicNavItems: NavItem[] = useMemo(() => [
    { name: "Sobre", link: "/about", enabled: true },
    { name: "Contato", link: "/contact", enabled: true },
  ], []);

  const currentNavItems = useMemo(() => {
    return authState.isLogged ? authenticatedNavItems : publicNavItems;
  }, [authState.isLogged, authenticatedNavItems, publicNavItems]);

  const isActiveItem = (link: string): boolean => pathname === link;

  const login = (username?: string) => {
    setAuthState({
      isLogged: true,
      username: username || "Usuário",
    });
  };

  const logout = () => {
    setAuthState({
      isLogged: false,
      username: undefined,
    });
    setIsOpen(false);
  };

  const closeSidebar = () => setIsOpen(false);

  const goToLogin = () => router.push("/authentication/login");
  const goToRegister = () => router.push("/authentication/register");

  return {
    isOpen,
    authState,
    currentNavItems,
    pathname,
    toggle,
    closeSidebar,
    login,
    logout,
    isActiveItem,
    goToLogin,
    goToRegister,
  };
};

export { useNavbar };
export type { NavItem, AuthState };