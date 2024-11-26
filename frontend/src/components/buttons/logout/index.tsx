"use client";

import { axiosInstance } from "@/services/axios";
import styles from "./main.module.css";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/auth";

const LogoutButton = () => {
  const { push } = useRouter();
  const { resetAuthData } = useAuthContext();
  const handleLogOut = () => {
    axiosInstance.get("/auth/logout").then(() => {
      resetAuthData();
      push("/feed");
    });
  };
  return (
    <button className={styles.logOutBtn} onClick={handleLogOut}>
      Log Out
    </button>
  );
};

export default LogoutButton;
