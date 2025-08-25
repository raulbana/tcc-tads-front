"use client";
import { useState } from "react";

interface NavItem {
  name: string;
  link: string;
  enabled: boolean;
}

const useNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLogged, setIsLogged] = useState(true);
  
  const toggle = () => setIsOpen(!isOpen);

  const navItems: NavItem[] = [
    { name: "Início", link: "/", enabled: true },
    { name: "Diário", link: "/diary", enabled: true },
    { name: "Exercícios", link: "/exercises", enabled: true },
    { name: "Conteúdos", link: "/contents", enabled: true },
    { name: "Relatórios", link: "/reports", enabled: true },
    { name: "Perfil", link: "/profile", enabled: true },
  ];

  const username = "Maria";

  const logout = () => {

    console.log("Logout realizado");
  };

  return {
    isOpen,
    toggle,
    navItems,
    isLogged,
    username,
    logout,
  };
};

export { useNavbar };