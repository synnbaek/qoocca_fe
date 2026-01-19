"use client";

import Link from "next/link";
import styles from "./Header.module.css";
import AuthSection from "../auth/AuthSection";
import { LogoIcon } from "../icons/LogoIcon";

import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <nav className={styles.header}>
      <Link href="/" className={styles.headerLogo} aria-label="쿠카티처스 홈">
        <LogoIcon />
      </Link>
      <div className={styles.headerLinks}>
        {!isAuthPage && <AuthSection />}
      </div>
    </nav>
  );
}
