'use client';

import LoginForm from './components/LoginForm';
import SignupSection from './components/SignupSection';
import styles from './login.module.css';
import socialStyles from './components/SocialLogin.module.css';
import SocialSection from './components/SocialSection';

export default function LoginPage() {
  return (
    <div className={styles.loginContainer}>
      <h2>
        학원 운영을 더 쉽게,
        <span className="highlight"> 쿠카티처스</span>
      </h2>
      <p>출결·수업·수납 한 번에 학원 관리 올인원 플랫폼</p>

      <SocialSection />

      <div className={socialStyles.divider}>또는</div>

      <LoginForm />
      <SignupSection />
    </div>
  );
}
