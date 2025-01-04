"use client";

import { FC, ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import styles from "./main.module.css";

import { axiosInstance } from "@/services/axios";
import { useAuthContext } from "@/contexts/auth";

type SetNewPasswordFormProps = {
  id: string;
  token: string;
};

const PasswordChangeForm: FC<SetNewPasswordFormProps> = ({ id, token }) => {
  const { register, formState, handleSubmit, getValues } = useForm();
  const { isSubmitting, errors } = formState;
  const onSubmit = async (data) => {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    const res = await axiosInstance.post(
      `/auth/password-reset-confirm/${id}/${token}/`,
      formData,
    );
    return res;
  };
  return (
    <form
      className={styles.formContainer}
      id="reset-password"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className={styles.fieldContainer}>
        <label htmlFor="new_password" className={styles.labelContainer}>
          New Password
        </label>
        <input
          id="new_password"
          placeholder="Your new password goes here"
          className={`${styles.inputContainer} ${
            errors.new_password ? styles.errorInput : ""
          }`}
          {...register("new_password", {
            required: {
              value: true,
              message: "New Password is a required field !",
            },
          })}
          type="password"
        />
        {errors.new_password && (
          <p className={styles.error}>
            {errors.new_password?.message as ReactNode}
          </p>
        )}
      </div>
      {errors.email && (
        <p className={styles.error}>{errors.email?.message as ReactNode}</p>
      )}
      <div className={styles.fieldContainer}>
        <label htmlFor="confirm_password" className={styles.labelContainer}>
          Confirm Password
        </label>
        <input
          id="confirm_password"
          placeholder="Your password goes here"
          className={`${styles.inputContainer} ${
            errors.confirm_password ? styles.errorInput : ""
          }`}
          {...register("confirm_password", {
            required: {
              value: true,
              message: "Confirm Password is a required field !",
            },
            validate: {
              confirmPassword: (val) =>
                val === getValues("new_password") ||
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

      <button disabled={isSubmitting} className={styles.submitBtn}>
        Change my password
      </button>
    </form>
  );
};

export default PasswordChangeForm;
