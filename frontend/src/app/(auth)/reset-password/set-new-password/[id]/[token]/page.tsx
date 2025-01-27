import { FC } from "react";

import AuthFormLayout from "@/components/auth-form-layout";
import PasswordChangeForm from "@/components/form/change-password";

import styles from "./main.module.css";

const PasswordChangePage: FC<{
  params: { id: string; token: string };
}> = ({ params }) => {
  const { token, id } = params;
  return (
    <>
      <header className={styles.headerText}>Enter new password</header>
      <p className={styles.instruction}>
        Please enter your new password twice so we can verify you typed it in
        correctly.
      </p>
      <AuthFormLayout>
        <PasswordChangeForm id={id} token={token} />
      </AuthFormLayout>
    </>
  );
};

export default PasswordChangePage;
