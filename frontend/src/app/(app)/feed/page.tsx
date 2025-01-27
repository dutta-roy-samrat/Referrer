import { FC } from "react";

import Feed from "@/components/feed";
import AddReferralModal from "@/components/modals/add-referral-modal";

import { axiosServerInstance } from "@/services/axios";

import styles from "./main.module.css";
import StyledLink from "@/components/ui/link/styled-link";

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
  } catch (e) {
    console.error(e);
  }
};

export default FeedPage;
