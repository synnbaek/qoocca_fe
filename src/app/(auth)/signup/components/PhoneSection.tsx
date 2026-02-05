'use client';

import styles from './PhoneSection.module.css';
import { usePhoneAuth } from '../../../../hooks/usePhoneAuth';

interface Props {
  phone: string;
  setPhone: (val: string) => void;
  code: string;
  setCode: (val: string) => void;
  isPhoneVerified: boolean;
  setIsPhoneVerified: (val: boolean) => void;
  isSocial?: boolean;
  setIsExistingUser?: (val: boolean) => void;
}

export default function PhoneSection(props: Props) {
  const {
    isCodeSent,
    timeLeft,
    isTimerActive,
    isLoading,
    formatTime,
    handleSendCode,
    handleVerifyCode,
  } = usePhoneAuth(props);

  const { phone, setPhone, code, setCode, isPhoneVerified } = props;

  return (
    <>
      <div className={styles.inputContainer}>
        <input
          type="tel"
          placeholder="휴대폰 번호 (- 제외)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={styles.insideInput}
          disabled={isPhoneVerified || isLoading}
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
                disabled={isLoading}
              >
                {isLoading ? '...' : isCodeSent ? '재발송' : '인증'}
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
            disabled={isPhoneVerified || isLoading}
            required
          />
          {!isPhoneVerified ? (
            <button
              type="button"
              onClick={handleVerifyCode}
              className={styles.insideBtn}
              disabled={timeLeft === 0 || isLoading}
            >
              {isLoading ? '...' : '확인'}
            </button>
          ) : (
            <span className={styles.verifiedText}>인증됨</span>
          )}
        </div>
      )}
    </>
  );
}