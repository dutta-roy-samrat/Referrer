import { FC } from "react";

import Feed from "@/components/feed";
import styles from "./main.module.css";

import { axiosServerInstance } from "@/services/axios";
import AddReferralModal from "@/components/modals/add-referral-modal";

const MyPosts: FC = async () => {
  try {
    const res = await axiosServerInstance.get("/posts/my-posts?start_from=0");
    return (
      <div className={styles.myPostsPage}>
        <div className={styles.pageTopSection}>
          <header className={styles.myPostsHeader}>My Posts</header>
          <AddReferralModal />
        </div>
        <main className={styles.content}>
          <Feed postList={res.data} showDeleteBtn/>
        </main>
      </div>
    );
  } catch (e) {
    console.error(e);
  }
};

export default MyPosts;
