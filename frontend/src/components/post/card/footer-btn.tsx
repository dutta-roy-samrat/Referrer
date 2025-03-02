"use client";

import ArrowOnHover from "@/components/ui/interactive-arrow-on-hover";

import styles from "./main.module.css";
import { useState } from "react";

const FooterBtn = ({ id }: { id: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <ArrowOnHover
      text="Check Description"
      href={`/post/${id}`}
      className={styles.checkDescriptionCta}
      onClick={() => setIsLoading(true)}
      loading={isLoading}
    />
  );
};

export default FooterBtn;
