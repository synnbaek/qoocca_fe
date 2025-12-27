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
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSendCode = async () => {
    if (!phone) {
      alert('전화번호를 먼저 입력해주세요.');
      return;
    }
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/send-code`,
        { phone }
      );
      alert('인증번호가 발송되었습니다.');
      setIsCodeSent(true);
    } catch (err: any) {
      // 백엔드에서 보낸 "이미 가입된 휴대폰 번호입니다." 메시지를 출력
      const errorMsg = err.response?.data || '인증번호 발송 실패';
      alert(errorMsg);

      // 만약 중복된 번호라면 입력창 초기화 등의 처리를 할 수 있습니다.
      if (errorMsg.includes('이미 가입된')) {
        setPhone('');
      }
    }
  };

  // 2. 인증번호 확인 함수 추가
  const handleVerifyCode = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-code`,
        { phone, code }
      );
      alert('인증에 성공했습니다.');
      setIsPhoneVerified(true); // 인증 완료 처리
    } catch (err: any) {
      alert('인증 실패: ' + (err.response?.data || err.message));
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    // 3. 인증 안되었으면 가입 차단
    if (!isPhoneVerified) {
      alert('휴대폰 인증을 먼저 완료해주세요.');
      return;
    }

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
      alert('회원가입 실패: ' + err);
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

        <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <AuthInput
              type="tel"
              placeholder="전화번호"
              value={phone}
              onChange={setPhone}
              disabled={isPhoneVerified} // 인증되면 수정 불가
              required
            />
          </div>
          <button
            type="button"
            onClick={handleSendCode}
            className="verify-btn"
            disabled={isPhoneVerified}
          >
            {isCodeSent ? '재발송' : '인증'}
          </button>
        </div>

        {isCodeSent && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
            <div style={{ flex: 1 }}>
              <AuthInput
                type="tel"
                placeholder="인증번호"
                value={code}
                onChange={setCode}
                disabled={isPhoneVerified} // 인증되면 수정 불가
                required
              />
            </div>
            {!isPhoneVerified && (
              <button
                type="button"
                onClick={handleVerifyCode}
                className="verify-btn"
              >
                확인
              </button>
            )}
          </div>
        )}

        {isPhoneVerified && (
          <p style={{ color: 'green', fontSize: '12px' }}>
            ✓ 인증 완료되었습니다.
          </p>
        )}

        <button type="submit" disabled={!isPhoneVerified}>
          회원가입
        </button>
      </form>
    </div>
  );
}
