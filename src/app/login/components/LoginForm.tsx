'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { setUserFromToken } from '@/store/userSlice';
import AuthInput from '@/components/AuthInput';
import axiosInstance from '@/api/axiosInstance';

export default function LoginForm() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value);
  }, []);

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post('/api/auth/login', {
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
    <>
      <form onSubmit={handleLogin}>
        <AuthInput
          type="email"
          placeholder="이메일"
          value={email}
          onChange={handleEmailChange}
          required
        />
        <AuthInput
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={handlePasswordChange}
          required
        />
        <button type="submit">로그인</button>
      </form>
    </>
  );
}
