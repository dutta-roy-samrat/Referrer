import Link from "next/link";

import AuthFormLayout from "@/components/auth-form-layout";
import SignUpForm from "@/components/form/sign-up";

const SignUp = () => (
  <>
    <div className="text-white font-bold text-2xl">Sign up to Referrer</div>
    <AuthFormLayout>
      <SignUpForm />
    </AuthFormLayout>
    <div className="text-white">
      Have an account?{" "}
      <Link href="/login" className="underline">
        Log In
      </Link>
    </div>
  </>
);

export default SignUp;
