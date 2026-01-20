'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setUserFromToken } from '@/store/userSlice';
import { toast } from 'sonner';
import Loading from '@/components/common/Loading';
import axiosInstance from '@/api/axiosInstance';
import { AcademyInfo } from '@/types/dashboard';
import { useState } from 'react';

interface SocialHandlerProps {
  provider: 'kakao' | 'naver';
}

export default function SocialHandler({ provider }: SocialHandlerProps) {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const router = useRouter();
  const dispatch = useDispatch();

  const [hasFetchedToken, setHasFetchedToken] = useState(false);

  const hasFetched = useRef(false); // useEffect가 두 번 실행되는 것을 방지

  useEffect(() => {
    if (!code || hasFetched.current) return;

    const getToken = async () => {
      hasFetched.current = true;

      try {
        const res = await axiosInstance.post(`/api/auth/${provider}`, { code });

        const { accessToken, socialId, academyId, academies } = res.data;

        if (accessToken === 'NEED_PHONE_AUTH') {
          toast.info('추가 휴대폰 인증이 필요합니다.');
          router.replace(
            `/social-auth?socialId=${encodeURIComponent(
              socialId
            )}&provider=${provider}`
          );
        } else {
          dispatch(setUserFromToken(accessToken));
          toast.success('로그인 성공!');
          router.replace('/academy');
        }
      } catch (err: any) {
        toast.error(
          err?.response?.data.message || '로그인 처리 중 오류가 발생했습니다.'
        );
        router.replace('/login');
      }
    };

    getToken();
  }, [code, provider, dispatch, router]);


  return (
    <>
      <Loading provider={provider} />
    </>
  );
}
