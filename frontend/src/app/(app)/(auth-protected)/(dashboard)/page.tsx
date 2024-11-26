import AddReferralModal from "@/components/modals/add-referral-modal";
import Image from "next/image";

import referralImg from "@/assets/illustrations/referral.svg";

import styles from "./main.module.css";

const Dashboard = () => {
  return (
    <div className={styles.bannerContainer}>
      <Image src={referralImg} alt="A person being referred" height={300} />
      <div className={styles.bannerRightSection}>
        <h1 className={styles.bannerTitle}>
          Your Job Post Could Be Someone's Big Break – Start Posting Now
        </h1>
        <AddReferralModal
          className={styles.addPostCta}
          iconClass={`${styles.addPostCtaIcon} group-hover:w-[192px] sm:group-hover:w-[492px]`}
        />
      </div>
    </div>
  );
};

export default Dashboard;
