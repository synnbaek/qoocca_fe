"use client";

import SignupForm from "./components/SignupForm";
import styles from "./signup.module.css";

export default function SignupPage() {
  return (
    <div className={styles.signupContainer}>
      <h2>회원가입</h2>
      <SignupForm />
    </div>
  );
}
