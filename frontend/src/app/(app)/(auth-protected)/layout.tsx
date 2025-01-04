"use client";

import PageLoader from "@/components/ui/loader/page-loader";
import { useAuthContext } from "@/contexts/auth";
import { usePathname, useRouter } from "next/navigation";
import { FC, ReactNode, useEffect } from "react";

const AuthProtectedLayout: FC<{ children: ReactNode }> = ({ children }) => {
  const { push } = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuthContext();
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      push(`/login?redirect=${pathname}`);
    }
  }, [isAuthenticated, isLoading, pathname, push]);

  if (isLoading) return <PageLoader />;
  if (isAuthenticated) return children;
};

export default AuthProtectedLayout;
