"use client";


import styles from "./Header.module.css";
import AuthSection from "../auth/AuthSection";
import { LogoIcon } from "../icons/LogoIcon";

import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const isAuthPage = 
    pathname === "/login" || 
    pathname === "/signup" || 
    pathname === "/social-auth" ||
    pathname?.startsWith("/oauth2");

  return (
    <nav className={styles.header}>
      <div className={styles.headerLogo} aria-label="쿠카티처스 로고">
        <LogoIcon />
      </div>
      {!isAuthPage && (
        <div className={styles.headerLinks}>
          <AuthSection />
        </div>
      )}
    </nav>
  );
}
