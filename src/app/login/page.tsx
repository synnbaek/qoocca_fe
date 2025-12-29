'use client';

import Link from 'next/link';
import KakaoLogin from '@/app/login/components/KakaoLogin';
import NaverLogin from '@/app/login/components/NaverLogin';
import LoginForm from './components/LoginForm';
import SignupSection from './components/SignupSection';

export default function LoginPage() {
  return (
    <div className="auth-container">
      <h2>로그인</h2>
      <LoginForm />
      {/* <Link href="/signup" className="email-login-btn">
        이메일 로그인
      </Link> */}
      <KakaoLogin />
      <NaverLogin />
      <SignupSection />
    </div>
  );
}
