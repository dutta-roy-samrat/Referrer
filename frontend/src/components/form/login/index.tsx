"use client";

import { ReactNode } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import { useRouter, useSearchParams } from "next/navigation";
import { useAuthContext } from "@/contexts/auth";

import StyledButton from "@/components/ui/button/styled-button";
import StyledLink from "@/components/ui/link/styled-link";

import { axiosInstance } from "@/services/axios";
import { onErrorToastMsg } from "@/services/toastify";

import { formDataSerializer } from "@/helpers/serializers";
import { getInputClass } from "@/helpers/utils";

import { EMAIL_VALIDATOR_REGEX } from "@/constants/validators";

import styles from "./main.module.css";

const LoginForm = () => {
  const { register, formState, handleSubmit } = useForm();
  const { isSubmitting, errors } = formState;
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const { refetchUserDetails } = useAuthContext();
  const redirectUrl = searchParams.get("redirect");

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const formData = formDataSerializer(data);
    axiosInstance
      .post("/auth/login/", formData)
      .then(() => {
        refetchUserDetails();
      })
      .then(() => {
        push(redirectUrl || "/");
      })
      .catch((err) => {
        onErrorToastMsg(err.message);
        console.error(err);
      });
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
          className={getInputClass({
            className: styles.inputContainer,
            error: errors.email,
          })}
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
          className={getInputClass({
            className: styles.inputContainer,
            error: errors.password,
          })}
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
      <StyledButton
        disabled={isSubmitting}
        loading={isSubmitting}
        className={styles.loginBtn}
      >
        Login
      </StyledButton>
      <StyledLink href="/reset-password" className={styles.forgotPasswordLink}>
        Forgot Password
      </StyledLink>
    </form>
  );
};

export default LoginForm;
