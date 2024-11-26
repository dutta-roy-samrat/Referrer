import Link from "next/link";

import AuthFormLayout from "@/components/auth-form-layout";
import LoginForm from "@/components/form/login";

const Login = () => (
  <>
    <div className="text-white font-bold text-2xl">Welcome Back</div>
    <AuthFormLayout>
      <LoginForm />
    </AuthFormLayout>
    <div className="text-white">
      Don't have an account?{" "}
      <Link href="/sign-up" className="underline">
        Sign Up
      </Link>
    </div>
  </>
);

export default Login;
