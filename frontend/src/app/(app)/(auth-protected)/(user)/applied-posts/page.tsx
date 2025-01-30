import { FC } from "react";

import Feed from "@/components/feed";
import StyledLink from "@/components/ui/link/styled-link";

import { axiosServerInstance } from "@/services/axios";

import styles from "./main.module.css";

export const dynamic = "force-dynamic";

const AppliedPosts: FC = async () => {
  try {
    const res = await axiosServerInstance.get("/posts/applied-to?start_from=0");
    return (
      <div className={styles.myPostsPage}>
        <div className={styles.pageTopSection}>
          <header className={styles.myPostsHeader}>Applied To</header>
          <StyledLink href="/feed" type="primary">
            Get Started
          </StyledLink>
        </div>
        <main className={styles.content}>
          <Feed postList={res.data} />
        </main>
      </div>
    );
  } catch (e) {
    console.error(e);
  }
};

export default AppliedPosts;
