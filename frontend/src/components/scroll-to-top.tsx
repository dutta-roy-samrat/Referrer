"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const ScrollToTop = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    scrollTo(0, 0);
  }, [pathname, searchParams]);

  return null;
};

export default ScrollToTop;
