import AuthFormLayout from "@/components/auth-form-layout";
import LoginForm from "@/components/form/login";
import StyledLink from "@/components/ui/link/styled-link";

import styles from "./main.module.css";

const Login = () => (
  <>
    <header className={styles.headerText}>Welcome Back</header>
    <AuthFormLayout>
      <LoginForm />
    </AuthFormLayout>
    <div className="text-white">
      Don't have an account?{" "}
      <StyledLink href="/sign-up" type="underlined">
        Sign Up
      </StyledLink>
    </div>
  </>
);

export default Login;
