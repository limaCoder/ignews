import { useState } from 'react';

import { ActiveLink } from '../ActiveLink';
import { SignInButton } from '../SignInButton';

import styles from './styles.module.scss';
import { FaTimes, FaBars } from 'react-icons/fa'

export function Header() {
  const [click, setClick] = useState(false);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  return(
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <img src="images/logo.svg" alt="ig.news"/>
        <nav className={click ? styles.navOptionsActive : styles.navOptions}>
          <ul>
            <ActiveLink activeClassName={styles.active} href="/">
              <a>Home</a>
            </ActiveLink>
            <ActiveLink activeClassName={styles.active} href="/posts">
              <a>Posts</a>
            </ActiveLink>
          </ul>

          <SignInButton />
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