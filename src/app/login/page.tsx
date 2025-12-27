'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Cookies from 'js-cookie';
import { setUserFromToken } from '@/store/userSlice';
import NaverIcon from '@/components/button/NaverIcon';
import KakaoButton from '@/components/button/KakaoButton';
import AuthInput from '@/components/button/AuthInput';
import { memo } from 'react';
import Link from 'next/link';

const SocialLoginSection = memo(function SocialLoginSection() {
  return (
    <div className="social-login">
      <KakaoButton />
      <button type="button" className="custom-social-btn naver">
        <NaverIcon />
        <span>네이버 로그인</span>
      </button>
    </div>
  );
});

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        password,
      });
      Cookies.set('accessToken', res.data.accessToken, {
        expires: 0.021,
        path: '/',
      });
      dispatch(setUserFromToken(res.data.accessToken));
      router.push('/');
    } catch (err: any) {
      alert('로그인 실패: ' + (err.response?.data || err.message));
    }
  };

  return (
    <div className="auth-container">
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <AuthInput
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(value) => setEmail(value)}
          required
        />
        <AuthInput
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(value) => setPassword(value)}
          required
        />
        <button type="submit">로그인</button>
      </form>

      <SocialLoginSection />

      <div className="signup-wrapper">
        <span>아직 회원이 아니신가요?</span>
        <Link href="/signup" className="signup-link-text">
          회원가입하기
        </Link>
      </div>
    </div>
  );
}
