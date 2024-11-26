import { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

import styles from "./main.module.css";

const AuthFormLayout = ({ children }: { children: ReactNode }) => (
  <Card className={styles.cardClass}>
    <CardContent className={styles.cardContent}>{children}</CardContent>
  </Card>
);

export default AuthFormLayout;
