"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import AuthSection from "../auth/AuthSection";
import { LogoIcon } from "../icons/LogoIcon";

export default function Header() {
  return (
    <nav className={styles.header}>
      <Link href="/" className={styles.headerLogo} aria-label="쿠카티처스 홈">
        <LogoIcon />
      </Link>
      <div className={styles.headerLinks}>
        <AuthSection />
      </div>
    </nav>
  );
}
