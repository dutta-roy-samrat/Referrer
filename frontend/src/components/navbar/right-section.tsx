"use client";

import { FC } from "react";
import { useAuthContext } from "@/contexts/auth";
import Link from "next/link";

import UserSheet from "@/components/user-sheet";
import NDotsLoader from "@/components/ui/loader/n-dots";

import styles from "./main.module.css";
import { useCurrentDeviceContext } from "@/contexts/device";
import { usePathname } from "next/navigation";

const NavRighSection: FC = () => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const { isResponsive } = useCurrentDeviceContext();
  const pathname = usePathname();
  if (isLoading) return <NDotsLoader numOfDots={5} />;
  const renderAuthenticatedLinks = () =>
    isAuthenticated ? (
      <>
        <Link
          href="/"
          className={`mr-3 rounded-lg p-3 hover:bg-gray-100 ${pathname === "/" ? "underline" : ""}`}
        >
          Dashboard
        </Link>
        <UserSheet />
      </>
    ) : (
      <Link
        className="rounded-full bg-black px-3 py-2 text-white hover:opacity-80"
        href="/login"
      >
        Login
      </Link>
    );
  const renderWebView = () => (
    <div className={styles.navbarLinks}>
      <Link
        href="/feed"
        className={`mr-3 rounded-lg p-3 hover:bg-gray-100 ${pathname === "/feed" ? "underline" : ""}`}
      >
        Feed
      </Link>
      {renderAuthenticatedLinks()}
    </div>
  );

  return !isResponsive ? renderWebView() : <UserSheet />;
};

export default NavRighSection;
