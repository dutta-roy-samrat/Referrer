"use client"

import { useAuthContext } from "@/contexts/auth";
import styles from "./main.module.css";

const Avatar = ({ className = "" }) => {
  const { data } = useAuthContext();
  const { full_name: fullName } = data;
  console.log(data, "kkl");
  const getAllWordInitializers = () => {
    let wordInitializers = "";
    for (let i = 0; i < fullName.length; i++) {
      if (i === 0 || fullName[i - 1] === " ") {
        wordInitializers += fullName[i].toUpperCase();
      }
    }
    return wordInitializers.slice(0, 3);
  };
  return (
    <div className={`${styles.avatarFallback} ${className}`}>
      {getAllWordInitializers()}
    </div>
  );
};

export default Avatar;
