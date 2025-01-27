import { cn } from "@/lib/utils";

import styles from "./main.module.css";

const ReferrerLogo = ({ className }: { className?: string }) => (
  <div className={cn(styles.logo, className)}>REFERRER</div>
);

export default ReferrerLogo;
