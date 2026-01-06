'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { setUserFromToken } from '@/store/userSlice';
import { toast } from 'sonner';
import PhoneSection from '../signup/components/PhoneSection';
import loginStyle from '../login/login.module.css';
import signupStyle from '../signup/components/SignupForm.module.css';
import TermsSection from '../signup/components/TermsSection';

export default function SocialAuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const socialId = searchParams.get('socialId');
  const provider = searchParams.get('provider');

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

  useEffect(() => {
    if (!socialId) {
      toast.error('잘못된 접근입니다.');
      router.push('/login');
    }
  }, [socialId, router]);

  const isRequiredAgreed = useMemo(() => {
    return agreements.service && agreements.privacy && agreements.thirdParty;
  }, [agreements]);

  const isSubmitDisabled = useMemo(() => {
    if (!isPhoneVerified) return true;
    if (isExistingUser) return false;
    return !isRequiredAgreed;
  }, [isPhoneVerified, isExistingUser, isRequiredAgreed]);

  const handleLinkAccount = async () => {
    if (isSubmitDisabled) return;

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/link-social`,
        {
          phone,
          socialId,
          provider,
          agreements: isExistingUser
            ? null
            : {
                allRequiredAgreed: isRequiredAgreed,
                marketing: agreements.marketing,
              },
        }
      );

      const { accessToken } = res.data;
      Cookies.set('accessToken', accessToken, { expires: 0.021, path: '/' });
      dispatch(setUserFromToken(accessToken));
      toast.success(
        isExistingUser ? '계정 통합 성공!' : '계정 연결 및 회원가입 성공!'
      );
      router.push('/');
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data ||
        err.message ||
        '알 수 없는 오류가 발생했습니다.';

      toast.error(`회원가입 실패: ${errorMessage}`);
      console.error('상세 에러 로그:', err);
    }
  };

  return (
    <div className={loginStyle.loginContainer}>
      <h2>추가 정보 입력</h2>
      <p>서비스 이용을 위해 휴대폰 인증이 필요합니다.</p>

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
        onClick={handleLinkAccount}
        disabled={!isPhoneVerified}
        className={signupStyle.signupButton}
      >
        {isExistingUser ? '계정 연결하기' : '회원가입 완료'}
      </button>
    </div>
  );
}
