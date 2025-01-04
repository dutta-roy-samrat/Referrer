import Feed from "@/components/feed";

import { axiosServerInstance } from "@/services/axios";

import styles from "./main.module.css";
import AddReferralModal from "@/components/modals/add-referral-modal";

const FeedPage = async () => {
  try {
    const res = await axiosServerInstance.get("/posts?start_from=0");
    return (
      <div className={styles.feedPage}>
        <div className={styles.pageTopSection}>
          <header className={styles.feedHeader}>
            <div>Live Feed</div>
            <div className={styles.liveFeedIcon}></div>
          </header>
          <AddReferralModal />
        </div>
        <main className="flex flex-col gap-4">
          {res.data.length ? (
            <Feed postList={res.data} />
          ) : (
            <div>
              No referrals are posted at the moment. Please check again later
              for any openings.
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
