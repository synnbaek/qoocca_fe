"use client";

import Link from "next/link";
import styles from "./SignupSection.module.css";

export default function SignupSection() {
  return (
    <div className={styles.signupWrapper}>
      <Link href="/signup" className={styles.signupLinkText}>
        이메일 회원가입
      </Link>
    </div>
  );
}
