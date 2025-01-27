"use client";

import { ReactNode } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

import { useAuthContext } from "@/contexts/auth";
import { useCurrentDeviceContext } from "@/contexts/device";

import StyledButton from "@/components/ui/button/styled-button";

import { formDataSerializer } from "@/helpers/serializers";

import { axiosInstance } from "@/services/axios";

import { onErrorToastMsg, onSuccessToastMsg } from "@/services/toastify";

import { EMAIL_VALIDATOR_REGEX } from "@/constants/validators";

import styles from "./main.module.css";

const SignUpForm = () => {
  const { register, getValues, formState, handleSubmit } = useForm();
  const { isSubmitting, errors } = formState;
  const { isResponsive, isDesktop } = useCurrentDeviceContext();
  const { push } = useRouter();
  const { setAuthenticationData } = useAuthContext();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const formData = formDataSerializer(data);
    axiosInstance
      .post("/auth/register/", formData)
      .then((res) => {
        const { payload, is_authenticated } = res.data;
        setAuthenticationData?.({
          data: payload,
          isAuthenticated: is_authenticated,
          isLoading: false,
        });
        onSuccessToastMsg("Successfully created a new user");
        push("/");
      })
      .catch((error) => {
        onErrorToastMsg(error.message);
        console.error("Error:", error);
      });
  };

  const getInputClassName = (errorField: string) =>
    `${styles.inputContainer} ${errors[errorField] ? styles.errorInput : ""}`;

  return (
    <form
      className={styles.formContainer}
      id="sign-up"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={styles.nameFieldContainer}>
        <div className={styles.fieldContainer}>
          <label htmlFor="first_name" className={styles.labelContainer}>
            First Name
          </label>
          <input
            id="first_name"
            placeholder="John"
            {...register("first_name", {
              required: {
                value: true,
                message: "First Name is a required field",
              },
            })}
            className={getInputClassName("first_name")}
          />
          {isResponsive && errors.first_name && (
            <p className={styles.error}>
              {errors.first_name?.message as ReactNode}
            </p>
          )}
        </div>
        <div className={styles.fieldContainer}>
          <label htmlFor="last_name" className={styles.labelContainer}>
            Last Name
          </label>
          <input
            id="last_name"
            placeholder="Doe"
            {...register("last_name", {
              required: {
                value: true,
                message: "Last Name is a required field",
              },
            })}
            className={getInputClassName("last_name")}
          />
          {isResponsive && errors.last_name && (
            <p className={styles.error}>
              {errors.last_name?.message as ReactNode}
            </p>
          )}
        </div>
      </div>
      {isDesktop && (errors.last_name || errors.first_name) && (
        <div className={styles.nameFieldContainer}>
          <p className={styles.error}>
            {errors.first_name?.message as ReactNode}
          </p>
          <p className={styles.error}>
            {errors.last_name?.message as ReactNode}
          </p>
        </div>
      )}
      <div className={styles.fieldContainer}>
        <label htmlFor="email" className={styles.labelContainer}>
          Email
        </label>
        <input
          id="email"
          placeholder="Enter your email here"
          className={getInputClassName("email")}
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
          className={getInputClassName("password")}
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
      <div className={styles.fieldContainer}>
        <label htmlFor="confirm_password" className={styles.labelContainer}>
          Confirm Password
        </label>
        <input
          id="confirm_password"
          placeholder="Confirm the password you entered above"
          className={getInputClassName("confirm_password")}
          {...register("confirm_password", {
            required: {
              value: true,
              message: "Confirm your password !",
            },
            validate: {
              confirmPassword: (val) =>
                val === getValues("password") ||
                "Password Fields don't match. Please re-check!",
            },
          })}
          type="password"
        />
        {errors.confirm_password && (
          <p className={styles.error}>
            {errors.confirm_password?.message as ReactNode}
          </p>
        )}
      </div>
      <StyledButton
        className={styles.signUpBtn}
        disabled={isSubmitting}
        loading={isSubmitting}
      >
        Sign Up
      </StyledButton>
    </form>
  );
};

export default SignUpForm;
