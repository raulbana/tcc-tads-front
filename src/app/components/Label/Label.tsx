import { TypographyItem } from "@/app/themes/typography";
import React from "react";

interface LabelProps {
  typography: TypographyItem;
  children: React.ReactNode;
  text: string;
  color?: string;
  className?: string;
}

const Label: React.FC<LabelProps> = ({
  typography,
  children,
  color = "text-black",
  className = "",
  text,
}) => {
  return (
    <span className={`${typography} ${color} ${className}`}>
      {text}
      {children && <span className="ml-1">{children}</span>}
    </span>
  );
};

export default Label;
