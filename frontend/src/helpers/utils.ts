import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

import { cn } from "@/lib/utils";

import styles from "./main.module.css";

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
