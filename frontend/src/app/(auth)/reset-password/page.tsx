import Link from "next/link";

import AuthFormLayout from "@/components/auth-form-layout";
import ResetPasswordForm from "@/components/form/reset-password";

import styles from "./main.module.css"

const ForgotPassword = () => {
  return (
    <>
      <div className="text-white font-bold text-2xl text-center">
        Enter your email to reset your password
      </div>
      <AuthFormLayout>
        <ResetPasswordForm />
      </AuthFormLayout>
      <Link href="/login" className={styles.loginLink}>
        Go To Login
      </Link>
    </>
  );
};

export default ForgotPassword;
