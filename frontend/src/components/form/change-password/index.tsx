"use client";

import { FC, ReactNode } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import StyledButton from "@/components/ui/button/styled-button";

import { axiosInstance } from "@/services/axios";

import { formDataSerializer } from "@/helpers/serializers";

import styles from "./main.module.css";
import { onErrorToastMsg, onSuccessToastMsg } from "@/services/toastify";
import { useRouter } from "next/navigation";

type SetNewPasswordFormProps = {
  id: string;
  token: string;
};

type FormType = {
  new_password: string;
  confirm_password: string;
};

const PasswordChangeForm: FC<SetNewPasswordFormProps> = ({ id, token }) => {
  const { register, formState, handleSubmit, getValues } = useForm<FormType>();
  const { push } = useRouter();

  const { isSubmitting, errors } = formState;

  const onSubmit: SubmitHandler<FormType> = (data) => {
    const formData = formDataSerializer(data);
    axiosInstance
      .post(`/auth/password-reset-confirm/${id}/${token}/`, formData)
      .then(({ data: resData }) => {
        onSuccessToastMsg(resData.message);
        push("/login");
      })
      .catch((err) => onErrorToastMsg(err.message));
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

      <StyledButton
        disabled={isSubmitting}
        className={styles.submitBtn}
      >
        Change my password
      </StyledButton>
    </form>
  );
};

export default PasswordChangeForm;
