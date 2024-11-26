"use client"

import { useAuthContext } from "@/contexts/auth";
import styles from "./main.module.css";

const Avatar = ({ className = "" }) => {
  const { data } = useAuthContext();
  const { full_name: fullName } = data;
  const getAllWordInitializers = () => {
    const firstName = fullName.split(" ")?.[0];
    const lastName = fullName.slice(firstName.length + 1,);
    const firstNameInitial = firstName ? firstName[0] : "";
    const lastNameInitial = lastName ? lastName[0] : "";
    return `${firstNameInitial}${lastNameInitial}`
  };
  return (
    <div className={`${styles.avatarFallback} ${className}`}>
      {getAllWordInitializers()}
    </div>
  );
};

export default Avatar;
