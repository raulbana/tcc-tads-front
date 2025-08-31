import React from "react";
import Link from "next/link";

interface NavItemProps {
  name: string;
  link: string;
  sidebar?: boolean;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({
  name,
  link,
  sidebar = false,
  isActive = false,
  onClick
}) => {

  return (
    <li
      className={`flex w-full justify-center items-center ${sidebar ? "mx-2 px-3 py-3" : "mx-1 px-2 py-2"
        } rounded-lg transition-all duration-200 ${sidebar
          ? "hover:bg-purple-01"
          : isActive
            ? "bg-purple-01"
            : "hover:bg-purple-01/50"
        }`}
    >
      <Link
        href={link}
        onClick={onClick}
        className={`text-gray-08 font-medium w-full text-center transition-colors duration-200 ${sidebar ? "text-base" : "text-sm"
          } ${isActive ? "text-purple-04" : "hover:text-purple-04"}`}
      >
        {name}
      </Link>
    </li>
  );
};

export default NavItem;