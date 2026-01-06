'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { setUserFromToken } from '@/store/userSlice';
import AuthInput from '@/components/auth/AuthInput';
import axiosInstance from '@/api/axiosInstance';
import styles from './LoginForm.module.css';
import { toast } from 'sonner';

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
      toast.success('로그인에 성공했습니다!');
      router.push('/');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || '로그인 정보를 확인해주세요.';
      toast.error(errorMessage);
    }
  };

  return (
    <>
      <form onSubmit={handleLogin} className={styles.form}>
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
        <div className={styles.forgotPasswordWrapper}>
          <span className={styles.passwordLinkText}>
            비밀번호를 잊으셨습니까?
          </span>
        </div>
        <button className={styles.loginButton} type="submit">
          로그인
        </button>
      </form>
    </>
  );
}
