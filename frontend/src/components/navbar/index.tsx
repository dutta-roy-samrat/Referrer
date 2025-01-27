import NavRighSection from "@/components/navbar/right-section";
import ReferrerLogo from "@/components/referrer-logo";
import StyledLink from "@/components/ui/link/styled-link";

import styles from "./main.module.css";

const Navbar = () => {
  return (
    <nav className={styles.navbarContainer}>
      <StyledLink href="/">
        <ReferrerLogo />
      </StyledLink>
      <NavRighSection />
    </nav>
  );
};

export default Navbar;
