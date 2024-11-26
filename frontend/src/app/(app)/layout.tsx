import Navbar from "@/components/navbar";
import AddReferralModal from "@/components/modals/add-referral-modal";

import styles from "./main.module.css";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.layoutContainer}>
      <Navbar />
      <AddReferralModal />
      {children}
    </div>
  );
}
