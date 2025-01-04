"use client";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import styles from "./main.module.css";
import { ReactNode } from "react";
import { axiosInstance } from "@/services/axios";
import { EMAIL_VALIDATOR_REGEX } from "@/constants/validators";
import { useRouter } from "next/navigation";

const ResetPasswordForm = () => {
  const { register, formState, handleSubmit } = useForm();
  const { push } = useRouter()
  const { isSubmitting, errors } = formState;
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    await axiosInstance.post("/auth/password-reset/", formData).then(() => push("/change-password"))
  };
  return (
    <form
      className={styles.formContainer}
      id="reset-password"
      onSubmit={handleSubmit(onSubmit)}
    >
      <label htmlFor="email" className={styles.labelContainer}>
        Email
      </label>
      <input
        id="email"
        className={`${styles.inputContainer} ${errors.email ? styles.errorInput : ""
          }`}
        {...register("email", {
          required: {
            value: true,
            message: "Email is a required field !",
          },
          pattern: {
            value: EMAIL_VALIDATOR_REGEX,
            message: "Invalid Email !",
          },
        })}
      />
      {errors.email && (
        <p className={styles.error}>{errors.email?.message as ReactNode}</p>
      )}
      <button disabled={isSubmitting} className={styles.submitBtn}>
        Submit
      </button>
    </form>
  );
};

export default ResetPasswordForm;
