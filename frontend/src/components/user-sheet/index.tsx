"use client";

import dynamic from "next/dynamic";

import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import HamburgerButton from "@/components/ui/button/hamburger";
import Avatar from "@/components/avatar";

import { useCurrentDeviceContext } from "@/contexts/device";


const UserSheetContent = dynamic(
  () => import("@/components/user-sheet/content"),
);

const UserSheet = () => {
  const { isResponsive } = useCurrentDeviceContext();

  return (
    <Sheet>
      <SheetTrigger>
        {isResponsive ? <HamburgerButton /> : <Avatar />}
      </SheetTrigger>
      <UserSheetContent />
    </Sheet>
  );
};

export default UserSheet;
