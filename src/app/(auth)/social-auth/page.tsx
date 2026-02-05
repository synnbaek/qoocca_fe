'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { useDispatch } from 'react-redux';
import { setUserFromToken } from '@/store/userSlice';
import { toast } from 'sonner';
import PhoneSection from '../signup/components/PhoneSection';
import loginStyle from '../login/login.module.css';
import TermsSection from '../signup/components/TermsSection';
import Button from '@/components/common/Button';
import axiosInstance from '@/api/axiosInstance';

function SocialAuthContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const socialId = searchParams.get('socialId');
  const provider = searchParams.get('provider');

  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isExistingUser, setIsExistingUser] = useState(false);
  const [agreements, setAgreements] = useState({
    service: false,
    privacy: false,
    thirdParty: false,
    marketing: false,
  });

  useEffect(() => {
    if (!socialId) {
      toast.error('잘못된 접근입니다.');
      router.replace('/login');
    }
  }, [socialId, router]);

  const isRequiredAgreed = useMemo(() => {
    return agreements.service && agreements.privacy && agreements.thirdParty;
  }, [agreements]);

  const canSubmit = useMemo(() => {
    if (!isPhoneVerified || isLoading) return false;
    if (isExistingUser) return true;
    return isRequiredAgreed;
  }, [isPhoneVerified, isLoading, isExistingUser, isRequiredAgreed]);

  const handleLinkAccount = async () => {
    if (!canSubmit) return;

    setIsLoading(true);
    try {
      const res = await axiosInstance.post('/api/auth/link-social', {
        phone,
        socialId,
        provider,
        agreements: isExistingUser
          ? null
          : {
            service: agreements.service,
            privacy: agreements.privacy,
            thirdParty: agreements.thirdParty,
            marketing: agreements.marketing,
          },
      });

      const { accessToken, academyId } = res.data;
      Cookies.set('accessToken', accessToken, { expires: 1, path: '/' });
      dispatch(setUserFromToken(accessToken));

      toast.success(isExistingUser ? '계정 연결 성공!' : '회원가입 성공!');

      if (academyId) {
        router.replace(`/academy/${academyId}`);
      } else {
        router.replace('/academy/register');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || '처리에 실패했습니다.');
    } finally {
      setIsLoading(false);
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

      <Button onClick={handleLinkAccount} disabled={!isPhoneVerified}>
        {isExistingUser ? '계정 연결하기' : '회원가입 완료'}
      </Button>
    </div>
  );
}

export default function SocialAuthPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SocialAuthContent />
    </Suspense>
  );
}