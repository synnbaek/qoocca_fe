"use client";


import styles from "./Header.module.css";
import AuthSection from "../auth/AuthSection";
import { LogoIcon } from "../icons/LogoIcon";

import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return (
    <nav className={styles.header}>
      <div className={styles.headerLogo} aria-label="쿠카티처스 로고">
        <LogoIcon />
      </div>
      <div className={styles.headerLinks}>
        {!isAuthPage && <AuthSection />}
      </div>
    </nav>
  );
}
