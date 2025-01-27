"use client";

import { useEffect } from "react";

import styles from "./main.module.css";

const PageLoader = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  return (
    <div className={styles.loaderContainer}>
      <div className={styles.pageLoader}></div>
    </div>
  );
};

export default PageLoader;
