import styles from "./main.module.css";

const ReferrerLogo = ({ className }: { className?: string }) => (
  <div className={`${styles.logo} ${className}`}>REFERRER</div>
);

export default ReferrerLogo;
