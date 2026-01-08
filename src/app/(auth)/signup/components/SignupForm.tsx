'use client';

import Cookies from 'js-cookie';
import { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setUserFromToken } from '@/store/userSlice';
import PhoneSection from './PhoneSection';
import TermsSection from './TermsSection';
import axiosInstance from '@/api/axiosInstance';

import styles from './SignupForm.module.css';
import { toast } from 'sonner';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';

export default function SignupForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const [agreements, setAgreements] = useState({
    service: false,
    privacy: false,
    thirdParty: false,
    marketing: false,
  });

  const isRequiredAgreed = useMemo(() => {
    return agreements.service && agreements.privacy && agreements.thirdParty;
  }, [agreements]);

  const isSubmitDisabled = useMemo(() => {
    if (isLoading) return true;
    if (!isPhoneVerified) return true;
    if (isExistingUser) return false;
    return !isRequiredAgreed;
  }, [isLoading, isPhoneVerified, isExistingUser, isRequiredAgreed]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const res = await axiosInstance.post('/api/auth/signup', {
        username,
        email,
        password,
        phone,
        code,
        agreements: isExistingUser
          ? null
          : {
              allRequiredAgreed: isRequiredAgreed,
              marketing: agreements.marketing,
            },
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
      toast.error('가입 실패: ' + (err.response?.data?.message || '오류 발생'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSignup} className={styles.form}>
        <Input
          type="text"
          placeholder="이름"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
          required
        />
        <Input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
          required
        />
        <Input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
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

        {isPhoneVerified && !isExistingUser && (
          <TermsSection agreements={agreements} setAgreements={setAgreements} />
        )}

        <Button variant="secondary" type="submit" disabled={isSubmitDisabled}>
          {isLoading ? '처리 중...' : isExistingUser ? '계정 연동' : '가입하기'}
        </Button>
      </form>
    </>
  );
}
