import Link from "next/link";
import styles from "./main.module.css";
import ReferrerLogo from "@/components/referrer-logo";
import NavRightSection from "./right-section";

const Navbar = () => {
  return (
    <nav className={styles.navbarContainer}>
      <Link href="/">
        <ReferrerLogo />
      </Link>
      <div className={styles.navbarLinks}>
        <Link href="/feed" className="hover:underline mr-3">
          Feed
        </Link>
        <NavRightSection />
      </div>
    </nav>
  );
};

export default Navbar;
