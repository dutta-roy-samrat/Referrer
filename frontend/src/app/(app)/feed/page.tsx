import Feed from "@/components/feed";

import { PostProps } from "@/components/post/card/types";

import { axiosServerInstance } from "@/services/axios";

import { POST_QUERY_LIMIT } from "@/constants/posts";
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
          <Feed postList={res.data}/>
        </main>
      </div>
    );
  } catch (e) {
    console.error(e);
  }
};

export default FeedPage;
