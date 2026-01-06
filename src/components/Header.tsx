'use client';

import Link from 'next/link';
import styles from './Header.module.css';
import AuthSection from './auth/AuthSection';

export default function Header() {
  return (
    <nav className={styles.header}>
      <Link href="/" className={styles.headerLogo}>
        쿠카티처스
      </Link>
      <div className={styles.headerLinks}>
        <AuthSection />
      </div>
    </nav>
  );
}
