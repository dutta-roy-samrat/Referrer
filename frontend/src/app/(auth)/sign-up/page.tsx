import { FC } from "react";

import AuthFormLayout from "@/components/auth-form-layout";
import SignUpForm from "@/components/form/sign-up";

import styles from "./main.module.css";
import StyledLink from "@/components/ui/link/styled-link";

const SignUp: FC = () => (
  <>
    <header className={styles.headerText}>Sign up to Referrer</header>
    <AuthFormLayout>
      <SignUpForm />
    </AuthFormLayout>
    <div className={styles.loginText}>
      Have an account?{" "}
      <StyledLink href="/login" type="underlined">
        Log In
      </StyledLink>
    </div>
  </>
);

export default SignUp;
