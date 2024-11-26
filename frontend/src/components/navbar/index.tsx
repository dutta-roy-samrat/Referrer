import Link from "next/link";

import NavRighSection from "@/components/navbar/right-section";
import ReferrerLogo from "@/components/referrer-logo";

import styles from "./main.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbarContainer}>
      <Link href="/">
        <ReferrerLogo />
      </Link>
      <NavRighSection />
    </nav>
  );
};

export default Navbar;
