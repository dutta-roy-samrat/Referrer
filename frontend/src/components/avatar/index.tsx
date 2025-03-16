"use client";

import Image from "next/image";

import { useAuthContext } from "@/contexts/auth";

import { cn } from "@/lib/utils";

import styles from "./main.module.css";

const Avatar = ({ avatarFallbackClass = "", avatarClass = "" }) => {
  const { data } = useAuthContext();
  const { firstName, lastName } = data;
  const getAllWordInitializers = () => {
    const firstNameInitial = firstName ? firstName[0] : "";
    const lastNameInitial = lastName ? lastName[0] : "";
    return `${firstNameInitial}${lastNameInitial}`;
  };
  return data.profileImage ? (
    <Image
      src={data.profileImage}
      alt="avatar"
      width={100}
      height={100}
      className={cn(styles.avatar, avatarClass)}
    />
  ) : (
    <div className={cn(styles.avatarFallback, avatarFallbackClass)}>
      {getAllWordInitializers()}
    </div>
  );
};

export default Avatar;
