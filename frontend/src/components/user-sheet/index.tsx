"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
  SheetFooter,
} from "@/components/ui/sheet";
import { getResponsiveUserLinks, USER_SHEET_LINKS } from "./constants";
import { Separator } from "../ui/separator";
import Avatar from "../avatar";
import LogoutButton from "../buttons/logout";
import { useCurrentDeviceContext } from "@/contexts/device";
import HamburgerButton from "../buttons/hamburger";
import { useAuthContext } from "@/contexts/auth";
import { useRouter } from "next/navigation";

const UserSheet = () => {
  const { isAuthenticated, data } = useAuthContext();
  const { isResponsive } = useCurrentDeviceContext();
  const { push } = useRouter();
  const userSheeLinks = isResponsive
    ? getResponsiveUserLinks({ isAuthenticated })
    : USER_SHEET_LINKS;
  const renderSheetLinks = () =>
    userSheeLinks.map(({ url, label }) => {
      if (!url) return <div className="text-gray-400">{label}</div>;
      return (
        <SheetClose
          className="p-3 text-left hover:rounded-md hover:bg-gray-100"
          onClick={() => push(url)}
          key={label}
        >
          {label}
        </SheetClose>
      );
    });
  return (
    <Sheet>
      <SheetTrigger>
        {!isResponsive ? <Avatar /> : <HamburgerButton />}
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>
            <div className="flex items-start justify-between pb-10 pt-4">
              <div className="flex flex-col items-start justify-between gap-3">
                <div>Account</div>
                <div className="font-extralight break-all">{data?.email}</div>
              </div>
              <Avatar />
            </div>
          </SheetTitle>
        </SheetHeader>

        <Separator />
        <section className="flex flex-col gap-3 pt-10 text-xl">
          {renderSheetLinks()}
        </section>
        <SheetFooter className="pt-10">
          <LogoutButton />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default UserSheet;
