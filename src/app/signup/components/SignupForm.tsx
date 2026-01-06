'use client';

import Cookies from 'js-cookie';
import { useState, useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setUserFromToken } from '@/store/userSlice';
import AuthInput from '@/components/auth/AuthInput';
import PhoneSection from './PhoneSection';
import TermsSection from './TermsSection';
import axiosInstance from '@/api/axiosInstance';

import styles from './SignupForm.module.css';
import { toast } from 'sonner';

export default function SignupForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const [agreements, setAgreements] = useState({
    service: false,
    privacy: false,
    thirdParty: false,
    marketing: false,
  });

  const [isExistingUser, setIsExistingUser] = useState(false);

  const isRequiredAgreed = useMemo(() => {
    return agreements.service && agreements.privacy && agreements.thirdParty;
  }, [agreements]);

  const handleUsernameChange = useCallback(
    (val: string) => setUsername(val),
    []
  );
  const handleEmailChange = useCallback((val: string) => setEmail(val), []);
  const handlePasswordChange = useCallback(
    (val: string) => setPassword(val),
    []
  );

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPhoneVerified) {
      toast.info('휴대폰 인증을 먼저 완료해주세요.');
      return;
    }

    if (!isExistingUser && !isRequiredAgreed) {
      toast.info('필수 약관에 모두 동의하셔야 회원가입이 가능합니다.');
      return;
    }

    try {
      const res = await axiosInstance.post('/api/auth/signup', {
        username,
        email,
        password,
        phone,
        code,
        agreements,
      });

      const { accessToken } = res.data;

      Cookies.set('accessToken', accessToken, {
        expires: 0.021,
        path: '/',
      });
      dispatch(setUserFromToken(res.data.accessToken));
      toast.success('회원가입 성공!');
      router.push('/');
    } catch (err: any) {
      toast.error('회원가입 실패: ' + err);
    }
  };

  const isSubmitDisabled = useMemo(() => {
    if (!isPhoneVerified) return true;

    if (isExistingUser) return false;

    return !isRequiredAgreed;
  }, [isPhoneVerified, isExistingUser, isRequiredAgreed]);

  return (
    <>
      <form onSubmit={handleSignup} className={styles.form}>
        <AuthInput
          type="text"
          placeholder="이름"
          value={username}
          onChange={handleUsernameChange}
          required
        />
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

        <PhoneSection
          phone={phone}
          setPhone={setPhone}
          code={code}
          setCode={setCode}
          isPhoneVerified={isPhoneVerified}
          setIsPhoneVerified={setIsPhoneVerified}
          setIsExistingUser={setIsExistingUser}
        />

        {!isExistingUser && isPhoneVerified && (
          <TermsSection agreements={agreements} setAgreements={setAgreements} />
        )}

        <button
          type="submit"
          className={styles.signupButton}
          disabled={isSubmitDisabled}
        >
          {isExistingUser ? '계정 통합 및 가입' : '회원가입'}
        </button>
      </form>
    </>
  );
}
