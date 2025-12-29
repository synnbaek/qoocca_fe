'use client';

import Cookies from 'js-cookie';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setUserFromToken } from '@/store/userSlice';
import AuthInput from '@/components/AuthInput';
import PhoneSection from './PhoneSection';
import axiosInstance from '@/api/axiosInstance';

export default function SignupForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPhoneVerified) {
      alert('휴대폰 인증을 먼저 완료해주세요.');
      return;
    }

    try {
      const res = await axiosInstance.post('/api/auth/signup', {
        username,
        email,
        password,
        phone,
        code,
      });

      const { accessToken } = res.data;

      Cookies.set('accessToken', accessToken, {
        expires: 0.021,
        path: '/',
      });
      dispatch(setUserFromToken(res.data.accessToken));
      alert('회원가입 성공!');
      router.push('/');
    } catch (err: any) {
      alert('회원가입 실패: ' + err);
    }
  };

  return (
    <>
      <form onSubmit={handleSignup}>
        <AuthInput
          type="text"
          placeholder="이름"
          value={username}
          onChange={setUsername}
          required
        />
        <AuthInput
          type="email"
          placeholder="이메일"
          value={email}
          onChange={setEmail}
          required
        />
        <AuthInput
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={setPassword}
          required
        />

        <PhoneSection
          phone={phone}
          setPhone={setPhone}
          code={code}
          setCode={setCode}
          isPhoneVerified={isPhoneVerified}
          setIsPhoneVerified={setIsPhoneVerified}
        />

        <button type="submit" disabled={!isPhoneVerified}>
          회원가입
        </button>
      </form>
    </>
  );
}
