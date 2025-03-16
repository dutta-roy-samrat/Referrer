import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import { jwtDecode } from "jwt-decode";

import { cn } from "@/lib/utils";

import styles from "./main.module.css";

interface JWTPayload {
  exp: number;
}

export const getFileUrl = (file: File | null) =>
  file ? URL.createObjectURL(file) : "";

export const getInputClass = ({
  className,
  error,
}: {
  className: string;
  error:
    | FieldError
    | Merge<FieldError, FieldErrorsImpl<any>>
    | boolean
    | undefined;
}) => cn(className, error ? styles.errorInput : "");


export const isTokenValid = (token: string): boolean => {
  try {
    const decoded = jwtDecode<JWTPayload>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
};