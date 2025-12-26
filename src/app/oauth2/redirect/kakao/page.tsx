'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Cookies from 'js-cookie';
import { setUserFromToken } from '@/store/userSlice';

function KakaoHandler() {
  const searchParams = useSearchParams();
  const code = searchParams.get('code');
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const getToken = async () => {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/auth/kakao`,
          { code },
          {
            withCredentials: true,
          }
        );

        const accessToken = res.data.accessToken;
        Cookies.set('accessToken', accessToken, { expires: 0.021 });
        dispatch(setUserFromToken(accessToken));
        router.push('/');
      } catch (err) {
        console.error('카카오 로그인 실패:', err);
        alert('카카오 로그인 실패');
        router.push('/login');
      }
    };

    if (code) getToken();
  }, [code, dispatch, router]);

  return <div>카카오 로그인 처리 중...</div>;
}

export default function OAuthRedirectKakaoPage() {
  return (
    <Suspense fallback={<div>로딩 중</div>}>
      <KakaoHandler />
    </Suspense>
  );
}
