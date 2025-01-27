"use client";

import { ReactNode } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import StyledButton from "@/components/ui/button/styled-button";

import { axiosInstance } from "@/services/axios";
import { onErrorToastMsg, onSuccessToastMsg } from "@/services/toastify";

import { formDataSerializer } from "@/helpers/serializers";

import { EMAIL_VALIDATOR_REGEX } from "@/constants/validators";

import styles from "./main.module.css";

const ResetPasswordForm = () => {
  const { register, formState, handleSubmit } = useForm();
  const { isSubmitting, errors } = formState;
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const formData = formDataSerializer(data);
    await axiosInstance
      .post("/auth/password-reset/", formData)
      .then(({ data: resData }) => onSuccessToastMsg(resData.message))
      .catch((err) => onErrorToastMsg(err.message));
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
      <StyledButton
        disabled={isSubmitting}
        className={styles.submitBtn}
        loading={isSubmitting}
      >
        Submit
      </StyledButton>
    </form>
  );
};

export default ResetPasswordForm;
