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
import { Separator } from "@/components/ui/separator";
import LogoutButton from "@/components/ui/button/logout";
import HamburgerButton from "@/components/ui/button/hamburger";
import StyledLink from "@/components/ui/link/styled-link";
import Avatar from "@/components/avatar";

import { useCurrentDeviceContext } from "@/contexts/device";
import { useAuthContext } from "@/contexts/auth";

import { getResponsiveUserLinks, USER_SHEET_LINKS } from "./constants";

import styles from "./main.module.css";

const UserSheet = () => {
  const { isAuthenticated, data } = useAuthContext();
  const { isResponsive } = useCurrentDeviceContext();

  const userSheeLinks = isResponsive
    ? getResponsiveUserLinks({ isAuthenticated })
    : USER_SHEET_LINKS;

  const renderSheetLinks = () =>
    userSheeLinks.map(({ url, label }) => {
      if (!url)
        return (
          <div className={styles.linkLabel} key={label}>
            {label}
          </div>
        );
      return (
        <SheetClose className={styles.sheetClose} key={label} asChild>
          <StyledLink href={url}>{label}</StyledLink>
        </SheetClose>
      );
    });

  const renderAvatarWebView = () => (
    <div className={styles.sheetTitleContainer}>
      <div className={styles.sheetTitleLeftContent}>
        <div>Account</div>
        <div className={styles.userEmail}>{data?.email}</div>
      </div>
      <Avatar />
    </div>
  );

  const renderAvatarResponsiveView = () => (
    <div className={styles.sheetResponsiveTitleContainer}>
      <div className={styles.sheetTitleLeftContent}>
        <div>Account</div>
        <Avatar />
      </div>
      <div className={styles.responsiveUserEmail}>{data?.email}</div>
    </div>
  );

  return (
    <Sheet>
      <SheetTrigger>
        {isResponsive ? <HamburgerButton /> : <Avatar />}
      </SheetTrigger>
      <SheetContent className={styles.sheetContent}>
        <SheetHeader>
          <SheetTitle>
            {isResponsive
              ? renderAvatarResponsiveView()
              : renderAvatarWebView()}
          </SheetTitle>
        </SheetHeader>
        <Separator />
        <section className={styles.sheetLinksContainer}>
          {renderSheetLinks()}
        </section>
        <SheetFooter className={styles.sheetFooter}>
          <LogoutButton />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default UserSheet;
