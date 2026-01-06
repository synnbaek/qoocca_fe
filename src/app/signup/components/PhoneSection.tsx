'use client';

import { useState, useEffect } from 'react';
import axiosInstance from '@/api/axiosInstance';
import styles from './PhoneSection.module.css';
import { toast } from 'sonner';

interface Props {
  phone: string;
  setPhone: (val: string) => void;
  code: string;
  setCode: (val: string) => void;
  isPhoneVerified: boolean;
  setIsPhoneVerified: (val: boolean) => void;
  isSocial?: boolean;
  setIsExistingUser?: (val: boolean) => void;
  setAgreements?: React.Dispatch<
    React.SetStateAction<{
      service: boolean;
      privacy: boolean;
      thirdParty: boolean;
      marketing: boolean;
    }>
  >;
}

export default function PhoneSection({
  phone,
  setPhone,
  code,
  setCode,
  isPhoneVerified,
  setIsPhoneVerified,
  isSocial = false,
  setIsExistingUser,
  setAgreements,
}: Props) {
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isTimerActive) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTimerActive]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSendCode = async () => {
    if (!phone) {
      toast.info('전화번호를 먼저 입력해주세요.');
      return;
    }
    try {
      await axiosInstance.post('/api/auth/send-code', {
        phone,
        ...(isSocial && { isSocial }),
      });
      toast.info('인증번호가 발송되었습니다.');

      setIsCodeSent(true);
      setTimeLeft(180);
      setIsTimerActive(true);
    } catch (err: any) {
      const errorMsg = err.response?.data || '인증번호 발송 실패';
      toast.error(errorMsg);

      if (errorMsg.includes('이미 가입된')) {
        setPhone('');
      }
    }
  };

  const handleVerifyCode = async () => {
    try {
      const res = await axiosInstance.post('/api/auth/verify-code', {
        phone,
        code,
      });
      toast.success('인증에 성공했습니다.');

      const { isExistingUser } = res.data;

      if (setIsExistingUser) setIsExistingUser(isExistingUser);

      setIsPhoneVerified(true);
    } catch (err: any) {
      toast.error('인증 실패: ' + (err.response?.data || err.message));
    }
  };

  return (
    <>
      <div className={styles.inputContainer}>
        <input
          type="tel"
          placeholder="휴대폰 번호 (- 제외)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={styles.insideInput}
          disabled={isPhoneVerified}
          required
        />
        {!isPhoneVerified && (
          <div className={styles.btnWrapper}>
            {isTimerActive ? (
              <span className={styles.timerText}>{formatTime(timeLeft)}</span>
            ) : (
              <button
                type="button"
                onClick={handleSendCode}
                className={styles.insideBtn}
              >
                {isCodeSent ? '재발송' : '인증'}
              </button>
            )}
          </div>
        )}
      </div>

      {isCodeSent && (
        <div className={styles.inputContainer}>
          <input
            type="tel"
            placeholder="인증번호"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className={styles.insideInput}
            disabled={isPhoneVerified}
            required
          />
          {!isPhoneVerified && (
            <button
              type="button"
              onClick={handleVerifyCode}
              className={styles.insideBtn}
              disabled={timeLeft === 0}
            >
              확인
            </button>
          )}
        </div>
      )}
    </>
  );
}
