"use client";

import { FC } from "react";
import { useAuthContext } from "@/contexts/auth";
import { usePathname } from "next/navigation";

import { useCurrentDeviceContext } from "@/contexts/device";

import UserSheet from "@/components/user-sheet";
import NDotsLoader from "@/components/ui/loader/n-dots";
import StyledLink from "@/components/ui/link/styled-link";

import styles from "./main.module.css";

const NavRighSection: FC = () => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const { isResponsive } = useCurrentDeviceContext();
  const pathname = usePathname();

  if (isLoading) return <NDotsLoader numOfDots={5} />;

  const renderNavBarLink = (label: string, href: string) => (
    <StyledLink
      href={href}
      className={`${styles.navBarLink} ${pathname === href ? styles.underLineLink : ""}`}
    >
      {label}
    </StyledLink>
  );

  const renderWebAuthenticatedLinks = () =>
    isAuthenticated ? (
      <>
        {renderNavBarLink("Dashboard", "/")}
        <UserSheet />
      </>
    ) : (
      <StyledLink type="primary" href="/login">
        Login
      </StyledLink>
    );

  const renderResponsiveAuthenticatedLinks = () =>
    isAuthenticated ? (
      <UserSheet />
    ) : (
      <StyledLink type="primary" href="/login">
        Login
      </StyledLink>
    );

  const renderWebView = () => (
    <div className={styles.navbarLinks}>
      {renderNavBarLink("Feed", "/feed")}
      {renderWebAuthenticatedLinks()}
    </div>
  );

  return isResponsive ? renderResponsiveAuthenticatedLinks() : renderWebView();
};

export default NavRighSection;
