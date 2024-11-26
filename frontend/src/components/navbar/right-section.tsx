"use client";

import { useAuthContext } from "@/contexts/auth";
import Link from "next/link";
import UserSheet from "../user-sheet";

const NavRightSection = () => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? (
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
};

export default NavRightSection;
