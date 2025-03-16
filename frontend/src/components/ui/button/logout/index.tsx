"use client";

import { useRouter } from "next/navigation";
import { MouseEventHandler } from "react";

import { useAuthContext } from "@/contexts/auth";

import StyledButton from "@/components/ui/button/styled-button";

import { axiosInstance } from "@/services/axios";

const LogoutButton = () => {
  const { push } = useRouter();
  const { resetAuthData } = useAuthContext();
  const handleLogOut: MouseEventHandler<HTMLButtonElement> | undefined = (
    e,
  ) => {
    e.stopPropagation();
    axiosInstance.post("/auth/logout/").then(() => {
      resetAuthData();
      push("/feed");
    });
  };

  return <StyledButton onClick={handleLogOut}>Log Out</StyledButton>;
};

export default LogoutButton;
