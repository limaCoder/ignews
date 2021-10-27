import { useState } from "react";
import Image from "next/image";

import { ActiveLink } from "../ActiveLink";
import { SignInButton } from "../SignInButton";

import styles from "./styles.module.scss";
import { FaTimes, FaBars } from "react-icons/fa";

export function Header() {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Image
          src="/images/logo.svg"
          width={145}
          height={20}
          alt="learnToCode"
        />
        <nav className={click ? styles.navOptionsActive : styles.navOptions}>
          <ul>
            <ActiveLink activeClassName={styles.active} href="/">
              <a>Home</a>
            </ActiveLink>
            <ActiveLink activeClassName={styles.active} href="/posts">
              <a>Posts</a>
            </ActiveLink>
          </ul>
        </nav>

        <div className={styles.mobileMenu} onClick={handleClick}>
          {click ? (
            <FaTimes className={styles.menuIcon} />
          ) : (
            <FaBars className={styles.menuIcon} />
          )}
        </div>
      </div>
    </header>
  );
}
