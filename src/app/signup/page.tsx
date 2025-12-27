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
  const [code, setCode] = useState('');

  const [isCodeSent, setIsCodeSent] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSendCode = async () => {
    if (!phone) {
      alert('전화번호를 먼저 입력해주세요.');
      return;
    }
    try {
      // 실제 API 연결 시 주석 해제
      // await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/send-code`, { phone });
      alert('인증번호가 발송되었습니다.');
      setIsCodeSent(true); // 입력창 나타나게 함
    } catch (err: any) {
      alert('발송 실패: ' + (err.response?.data || err.message));
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
        {
          username,
          email,
          password,
          phone,
          code,
        }
      );

      const { accessToken } = res.data;

      Cookies.set('accessToken', accessToken, {
        expires: 0.021,
        path: '/',
      });
      dispatch(setUserFromToken(res.data.accessToken));
      alert('회원가입 성공!');
      router.push('/');
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
          value={username}
          onChange={(value) => setUsername(value)}
          required
        />
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
        {/* 3. 전화번호 입력 및 인증 버튼 */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <AuthInput
              type="tel"
              placeholder="전화번호"
              value={phone}
              onChange={(value) => setPhone(value)}
              required
            />
          </div>
          <button type="button" onClick={handleSendCode} className="verify-btn">
            인증
          </button>
        </div>

        {/* 4. 인증번호 입력창 (조건부 렌더링) */}
        {isCodeSent && (
          <AuthInput
            type="tel"
            placeholder="인증번호"
            value={code}
            onChange={(value) => setCode(value)}
            required
          />
        )}
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}
