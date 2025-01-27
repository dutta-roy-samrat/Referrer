import { FC, ReactNode } from "react";

import ReferrerLogo from "@/components/referrer-logo";
import StyledLink from "@/components/ui/link/styled-link";

import styles from "./main.module.css";

const AuthLayout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.leftContentContainer}>
        <ReferrerLogo className={styles.logo} />
        <div className={styles.motto}>
          Effortless Referrals, Endless Opportunities
        </div>
        <StyledLink href="/feed" className={styles.animatedBtn}>
          Go Explore Our Feed
        </StyledLink>
      </div>
      <article className={styles.rightContentContainer}>{children}</article>
    </div>
  );
};

export default AuthLayout;
