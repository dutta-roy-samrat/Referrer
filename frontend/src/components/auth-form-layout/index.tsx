import { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

import { cn } from "@/lib/utils";

import styles from "./main.module.css";

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
    <Card className={cn(styles.card, cardClass)}>
      <CardContent className={cn(styles.cardContent, cardContentClass)}>
        {children}
      </CardContent>
    </Card>
  );
};

export default AuthFormLayout;
