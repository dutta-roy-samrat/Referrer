import { FC, ReactNode } from "react";
import styles from "@/components/post/card/main.module.css";

const JobField: FC<{ icon: ReactNode; text: string }> = ({ icon, text }) => (
  <div className={styles.contentFieldContainer}>
    {icon}
    <span>{text}</span>
  </div>
);

export default JobField;