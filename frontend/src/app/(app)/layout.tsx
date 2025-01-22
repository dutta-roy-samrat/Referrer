import Navbar from "@/components/navbar";

import styles from "./main.module.css";
import AuthProvider from "@/contexts/auth";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <Navbar />
      <div className="p-6">{children}</div>
    </AuthProvider>
  );
}
