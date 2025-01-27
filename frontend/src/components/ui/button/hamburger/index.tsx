import styles from "./main.module.css";

const HamburgerButton = () =>
  Array.from({ length: 3 }).map((_, idx) => (
    <div className={styles.hamburgerLine} key={idx}></div>
  ));

export default HamburgerButton;
