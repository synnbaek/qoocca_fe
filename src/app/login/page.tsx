'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Cookies from 'js-cookie';
import { setUserFromToken } from '@/store/userSlice';
import NaverIcon from '@/components/NaverIcon';
import KakaoIcon from '@/components/KaKaoIcon';

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const KAKAO_AUTH_LOGIN_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;

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

  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_LOGIN_URL;
  };

  return (
    <div className="auth-container">
      <h2>로그인</h2>
      <form onSubmit={handleLogin}>
        <input
          value={email}
          placeholder="이메일"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          value={password}
          placeholder="비밀번호"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">로그인</button>
      </form>

      <div className="social-login">
        <button
          type="button"
          className="custom-social-btn kakao"
          onClick={handleKakaoLogin}
        >
          <KakaoIcon />
          <span>카카오 로그인</span>
        </button>

        <button type="button" className="custom-social-btn naver">
          <NaverIcon />
          <span>네이버 로그인</span>
        </button>
      </div>
    </div>
  );
}
