import Navbar from "@/components/navbar";

import styles from "./main.module.css";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={styles.layoutContainer}>
      <Navbar />
      {children}
    </div>
  );
}
