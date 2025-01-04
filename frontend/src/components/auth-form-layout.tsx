import { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { cn } from "@/lib/utils";

const AuthFormLayout = ({
  children,
  cardClass = "",
  cardContentClass = "",
}: {
  children: ReactNode;
  cardClass?: string;
  cardContentClass?: string;
}) => {
  return (
    <Card
      className={cn(
        "flex w-full flex-col items-center justify-center border-none bg-black py-10 lg:w-auto lg:border-white lg:bg-white",
        cardClass,
      )}
    >
      <CardContent className={cn("w-full py-0 lg:w-auto", cardContentClass)}>
        {children}
      </CardContent>
    </Card>
  );
};

export default AuthFormLayout;
