'use client';

import { useState } from 'react';
import AuthInput from '@/components/AuthInput';
import axiosInstance from '@/api/axiosInstance';

interface Props {
  phone: string;
  setPhone: (val: string) => void;
  code: string;
  setCode: (val: string) => void;
  isPhoneVerified: boolean;
  setIsPhoneVerified: (val: boolean) => void;
}

export default function PhoneSection({
  phone,
  setPhone,
  code,
  setCode,
  isPhoneVerified,
  setIsPhoneVerified,
}: Props) {
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleSendCode = async () => {
    if (!phone) {
      alert('전화번호를 먼저 입력해주세요.');
      return;
    }
    try {
      await axiosInstance.post('/api/auth/send-code', { phone });
      alert('인증번호가 발송되었습니다.');
      setIsCodeSent(true);
    } catch (err: any) {
      const errorMsg = err.response?.data || '인증번호 발송 실패';
      alert(errorMsg);

      if (errorMsg.includes('이미 가입된')) {
        setPhone('');
      }
    }
  };

  const handleVerifyCode = async () => {
    try {
      await axiosInstance.post('/api/auth/verify-code', { phone, code });
      alert('인증에 성공했습니다.');
      setIsPhoneVerified(true);
    } catch (err: any) {
      alert('인증 실패: ' + (err.response?.data || err.message));
    }
  };

  return (
    <>
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

      {isPhoneVerified && (
        <p style={{ color: 'green', fontSize: '12px' }}>
          ✓ 인증 완료되었습니다.
        </p>
      )}
    </>
  );
}
