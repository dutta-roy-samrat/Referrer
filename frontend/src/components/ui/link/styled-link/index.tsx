import { AnchorHTMLAttributes, FC, ReactNode, RefAttributes } from "react";
import Link, { LinkProps } from "next/link";

import { cn } from "@/lib/utils";

import styles from "./main.module.css";

type StyledLinkProps = {
  className?: string;
  type?: "primary" | "underlined" | "";
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> &
  LinkProps & {
    children?: ReactNode;
  } & RefAttributes<HTMLAnchorElement>;

const getLinkStyles = (type: string) => {
  switch (type) {
    case "primary":
      return styles.primaryBtn;
    case "underlined":
      return styles.underlined;
    default:
      return "";
  }
};

const StyledLink: FC<StyledLinkProps> = ({
  className = "",
  type = "",
  children,
  target = "",
  rel = "",
  ...linkProps
}) => {
  const linkRel = target === "_blank" ? { rel: `noopener ${rel}` } : {};
  return (
    <Link
      className={cn(getLinkStyles(type), className)}
      target={target}
      {...linkRel}
      {...linkProps}
    >
      {children}
    </Link>
  );
};

export default StyledLink;
