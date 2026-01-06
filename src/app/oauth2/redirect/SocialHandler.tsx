'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Cookies from 'js-cookie';
import { setUserFromToken } from '@/store/userSlice';
import { toast } from 'sonner';
import Loading from '@/components/Loading';

interface SocialHandlerProps {
  provider: 'kakao' | 'naver';
}

export default function SocialHandler({ provider }: SocialHandlerProps) {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const getToken = async () => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/${provider}`,
          { code }
        );

        if (res.data.accessToken === 'NEED_PHONE_AUTH') {
          const socialId = res.data.refreshToken;

          if (!socialId) {
            throw new Error('소셜 식별 정보(socialId)가 없습니다.');
          }

          toast.info('추가 휴대폰 인증이 필요합니다.');
          router.push(
            `/social-auth?socialId=${encodeURIComponent(
              socialId
            )}&provider=${provider}`
          );
        } else {
          const accessToken = res.data.accessToken;
          Cookies.set('accessToken', accessToken, {
            expires: 0.021,
            path: '/',
          });
          dispatch(setUserFromToken(accessToken));
          router.push('/');
        }
      } catch (err: any) {
        console.error(
          `${provider} 로그인 에러 상세:`,
          err.response?.data || err.message
        );
        toast.error('로그인 처리 중 오류가 발생했습니다.');
        router.push('/login');
      }
    };

    if (code) getToken();
  }, [code, dispatch, router, provider]);

  return <Loading provider={provider} />;
}
