import Feed from "@/components/feed";
import styles from "./main.module.css";

import { axiosServerInstance } from "@/services/axios";
import Link from "next/link";

const AppliedPosts = async () => {
  try {
    const res = await axiosServerInstance.get("/posts/applied-to?start_from=0");
    return (
      <div className={styles.myPostsPage}>
        <div className={styles.pageTopSection}>
          <header className={styles.myPostsHeader}>Applied To</header>
          <Link href="/feed" className="rounded-3xl bg-black text-white py-3 px-5">
            Get Started
          </Link>
        </div>
        <main className="flex flex-col gap-4">
          <Feed postList={res.data} />
        </main>
      </div>
    );
  } catch (e) {
    console.error(e);
  }
};

export default AppliedPosts;
