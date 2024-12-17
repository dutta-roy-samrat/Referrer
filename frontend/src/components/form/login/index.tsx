"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { EMAIL_VALIDATOR_REGEX } from "@/constants/validators";

import styles from "./main.module.css";
import { axiosInstance } from "@/services/axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/contexts/auth";

const LoginForm = () => {
  const { register, formState, handleSubmit } = useForm();
  const { isSubmitting, errors } = formState;
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const { refetchUserDetails } = useAuthContext();

  const redirectUrl = searchParams.get("redirect");

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    axiosInstance
      .post("/auth/login/", formData)
      .then(() => {
        refetchUserDetails();
      })
      .then(() => {
        push(redirectUrl || "/");
      })
      .catch((err) => console.error(err));
  };

  return (
    <form
      className={styles.formContainer}
      id="login"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={styles.fieldContainer}>
        <label htmlFor="email" className={styles.labelContainer}>
          Email
        </label>
        <input
          id="email"
          placeholder="Enter your email here"
          className={`${styles.inputContainer} ${
            errors.email ? styles.errorInput : ""
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
      </div>
      <div className={styles.fieldContainer}>
        <label htmlFor="password" className={styles.labelContainer}>
          Password
        </label>
        <input
          id="password"
          placeholder="Your password goes here"
          className={`${styles.inputContainer} ${
            errors.password ? styles.errorInput : ""
          }`}
          {...register("password", {
            required: {
              value: true,
              message: "Password is a required field !",
            },
          })}
          type="password"
        />
        {errors.password && (
          <p className={styles.error}>
            {errors.password?.message as ReactNode}
          </p>
        )}
      </div>
      <button className={styles.loginBtn} disabled={isSubmitting}>
        Login
      </button>
      <Link href="/reset-password" className={styles.forgotPasswordLink}>
        Forgot Password
      </Link>
    </form>
  );
};

export default LoginForm;
