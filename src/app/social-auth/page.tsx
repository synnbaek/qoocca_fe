'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { setUserFromToken } from '@/store/userSlice';
import AuthInput from '@/components/button/AuthInput';

export default function SocialAuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  // URL 쿼리 파라미터에서 socialId 추출
  const socialId = searchParams.get('socialId');

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // socialId가 없으면 잘못된 접근이므로 홈으로 보냄
  useEffect(() => {
    if (!socialId) {
      alert('잘못된 접근입니다.');
      router.push('/login');
    }
  }, [socialId, router]);

  const handleSendCode = async () => {
    if (!phone) return alert('전화번호를 입력해주세요.');
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/send-code`,
        { phone, isSocial: true }
      );
      alert('인증번호가 발송되었습니다.');
      setIsCodeSent(true);
    } catch (err: any) {
      alert(err.response?.data || '인증번호 발송 실패');
    }
  };

  const handleVerifyCode = async () => {
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-code`,
        { phone, code }
      );
      alert('인증 성공!');
      setIsPhoneVerified(true);
    } catch (err: any) {
      alert('인증번호가 일치하지 않습니다.');
    }
  };

  const handleLinkAccount = async () => {
    if (!isPhoneVerified) return alert('휴대폰 인증이 필요합니다.');
    try {
      // 소셜 계정과 휴대폰 번호를 연결하는 API 호출
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/link-social`,
        {
          phone,
          socialId,
        }
      );

      const { accessToken } = res.data;
      Cookies.set('accessToken', accessToken, { expires: 0.021, path: '/' });
      dispatch(setUserFromToken(accessToken));
      alert('계정 연결 및 로그인 성공!');
      router.push('/');
    } catch (err: any) {
      alert('연결 실패: ' + (err.response?.data || err.message));
    }
  };

  return (
    <div className="auth-container">
      <h2>추가 정보 입력</h2>
      <p>서비스 이용을 위해 휴대폰 인증이 필요합니다.</p>

      <div style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
          <div style={{ flex: 1 }}>
            <AuthInput
              type="tel"
              placeholder="전화번호"
              value={phone}
              onChange={setPhone}
              disabled={isPhoneVerified}
              required
            />
          </div>
          <button
            type="button"
            onClick={handleSendCode}
            disabled={isPhoneVerified}
            className="verify-btn"
          >
            인증
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
                disabled={isPhoneVerified}
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

        <button
          onClick={handleLinkAccount}
          disabled={!isPhoneVerified}
          style={{
            width: '100%',
            padding: '0.75rem',
            backgroundColor: isPhoneVerified ? '#000' : '#ccc',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          시작하기
        </button>
      </div>
    </div>
  );
}
