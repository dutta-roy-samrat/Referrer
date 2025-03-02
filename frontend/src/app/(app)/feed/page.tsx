import { FC } from "react";
import lazyload from "next/dynamic";

import Feed from "@/components/feed";
import StyledLink from "@/components/ui/link/styled-link";

import { axiosServerInstance } from "@/services/axios";

import styles from "./main.module.css";

export const dynamic = "force-dynamic";

const AddReferralModal = lazyload(
  () => import("@/components/modals/add-referral-modal"),
);

const FeedPage: FC = async () => {
  try {
    const res = await axiosServerInstance.get("/posts?start_from=0");
    return (
      <div className={styles.feedPage}>
        <div className={styles.pageTopSection}>
          <header className={styles.feedHeader}>
            <div>Live Feed</div>
            <div className={styles.liveFeedIcon}></div>
          </header>
          <AddReferralModal
            className={styles.addPostCta}
            iconClass={`${styles.addPostCtaIcon} group-hover:w-[134px] md:group-hover:w-[148px]`}
          />
        </div>
        <main className={styles.content}>
          {res.data.length ? (
            <Feed postList={res.data} />
          ) : (
            <div>
              No referrals are posted from others at the moment. Please check
              again later for any openings. You can check the referrals you
              posted{" "}
              <StyledLink type="underlined" href="/my-posts">
                here
              </StyledLink>{" "}
              .
            </div>
          )}
        </main>
      </div>
    );
  } catch {
    return (
      <div>
        Facing issues from server, our team is currently looking into it.
      </div>
    );
  }
};

export default FeedPage;
