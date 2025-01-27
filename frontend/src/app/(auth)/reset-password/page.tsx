"use client";

import AuthFormLayout from "@/components/auth-form-layout";
import ResetPasswordForm from "@/components/form/reset-password";

import styles from "./main.module.css";

const ForgotPassword = () => {
  return (
    <>
      <header className={styles.headerText}>
        Enter your email to reset your password
      </header>
      <AuthFormLayout>
        <ResetPasswordForm />
      </AuthFormLayout>
    </>
  );
};

export default ForgotPassword;
