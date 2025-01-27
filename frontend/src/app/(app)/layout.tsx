import Navbar from "@/components/navbar";

import AuthProvider from "@/contexts/auth";

import styles from "./main.module.css";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <Navbar />
      <div className={styles.layout}>{children}</div>
    </AuthProvider>
  );
}
