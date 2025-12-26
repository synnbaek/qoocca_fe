'use client';

import axios from 'axios';
import Cookies from 'js-cookie';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setUserFromToken } from '@/store/userSlice';
import AuthInput from '@/components/button/AuthInput';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        '${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup',
        {
          username,
          email,
          password,
          phone,
        }
      );

      const { accessToken } = res.data;

      Cookies.set('accessToken', accessToken, {
        expires: 0.021,
        path: '/',
      });
      dispatch(setUserFromToken(res.data.accessToken));
      alert('회원가입 성공!');
      router.push('/l');
    } catch (err: any) {
      alert('회원가입 실패: ' + (err.response?.data || err.message));
    }
  };

  return (
    <div className="auth-container">
      <h2>회원가입</h2>
      <form onSubmit={handleSignup}>
        <AuthInput
          type="text"
          placeholder="이름"
          onBlur={(value) => setUsername(value)}
          required
        />
        <AuthInput
          type="email"
          placeholder="이메일"
          onBlur={(value) => setEmail(value)}
          required
        />
        <AuthInput
          type="password"
          placeholder="비밀번호"
          onBlur={(value) => setPassword(value)}
          required
        />
        <AuthInput
          type="tel"
          placeholder="전화번호"
          onBlur={(value) => setPhone(value)}
          required
        />
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}
