"use client";

import { useAuthContext } from "@/contexts/auth";
import styles from "./main.module.css";

const Avatar = ({ className = "" }) => {
  const { data } = useAuthContext();
  const { firstName, lastName } = data;
  const getAllWordInitializers = () => {
    const firstNameInitial = firstName ? firstName[0] : "";
    const lastNameInitial = lastName ? lastName[0] : "";
    return `${firstNameInitial}${lastNameInitial}`;
  };
  return (
    <div className={`${styles.avatarFallback} ${className}`}>
      {getAllWordInitializers()}
    </div>
  );
};

export default Avatar;
