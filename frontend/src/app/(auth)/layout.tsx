import Link from "next/link";
import { ReactNode } from "react";

import ReferrerLogo from "@/components/referrer-logo";

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="grid lg:grid-cols-2 h-full w-full bg:black lg:bg-transparent">
      <div className="flex justify-center items-center flex-col gap-5 bg-white text-black pt-24 pb-14">
        <ReferrerLogo className="animate-fade-in" />
        <div className="animate-forward-slide text-lg tracking-widest text-center font-extralight px-3">
          Effortless Referrals, Endless Opportunities
        </div>
        <Link
          href="/feed"
          className="text-white bg-black rounded-md py-2 px-3 tracking-widest animate-fade-in"
        >
          Go Explore Our Feed
        </Link>
      </div>

      <div className="bg-black flex justify-center items-center flex-col gap-4  pt-10 pb-24">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout;
