"use client";

import { FC } from "react";
import { useAuthContext } from "@/contexts/auth";
import Link from "next/link";

import UserSheet from "@/components/user-sheet";
import NDotsLoader from "@/components/ui/loader/n-dots";

import styles from "./main.module.css";
import { useCurrentDeviceContext } from "@/contexts/device";

const NavRighSection: FC = () => {
  const { isAuthenticated, isLoading } = useAuthContext();
  const { isResponsive } = useCurrentDeviceContext();
  if (isLoading) return <NDotsLoader numOfDots={5} />;
  const renderAuthenticatedLinks = () =>
    isAuthenticated ? (
      <>
        <Link href="/" className="hover:underline mr-3">
          Dashboard
        </Link>
        <UserSheet />
      </>
    ) : (
      <Link
        className="bg-black text-white py-2 px-3 rounded-full hover:opacity-80"
        href="/login"
      >
        Login
      </Link>
    );
  const renderWebView = () => (
    <div className={styles.navbarLinks}>
      <Link href="/feed" className="hover:underline mr-3">
        Feed
      </Link>
      {renderAuthenticatedLinks()}
    </div>
  );

  return !isResponsive ? renderWebView() : <UserSheet />;
};

export default NavRighSection;
