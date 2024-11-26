"use client";

import { useForm } from "react-hook-form";

import styles from "./main.module.css";
import { ReactNode } from "react";

const ForgotPasswordForm = () => {
  const { register, formState, handleSubmit } = useForm();
  const { isSubmitting, errors } = formState;
  const onSubmit = async () => {
    const res = await fetch("");
    return res;
  };
  return (
    <form
      className={styles.formContainer}
      id="forgot-password"
      onSubmit={handleSubmit(onSubmit)}
    >
      <label htmlFor="email" className={styles.labelContainer}>
        Email
      </label>
      <input
        id="email"
        className={`${styles.inputContainer} ${
          errors.email ? styles.errorInput : ""
        }`}
        {...register("email", {
          required: {
            value: true,
            message: "Email is a required field !",
          },
          pattern: {
            value: /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2, 4}$/,
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

export default ForgotPasswordForm;
