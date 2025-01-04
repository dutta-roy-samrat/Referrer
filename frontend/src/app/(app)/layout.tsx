import Navbar from "@/components/navbar";

import styles from "./main.module.css";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <div className="p-6">{children}</div>
    </>
  );
}
