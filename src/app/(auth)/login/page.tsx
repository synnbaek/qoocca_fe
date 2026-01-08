import Link from 'next/link';
import styles from './login.module.css';
import LoginForm from './components/LoginForm';
import SocialSection from './components/SocialSection';

export default function LoginPage() {
  return (
    <>
      <h2>
        학원 운영을 더 쉽게,
        <span className="highlight"> 쿠카티처스</span>
      </h2>
      <p>출결·수업·수납 한 번에 학원 관리 올인원 플랫폼</p>
      <SocialSection />
      <div className={styles.divider}>또는</div>
      <LoginForm />
      <div className={styles.signupWrapper}>
        <Link href="/signup" className={styles.signupLinkText}>
          이메일 회원가입
        </Link>
      </div>
    </>
  );
}
