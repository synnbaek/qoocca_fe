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

        // const { accessToken, hasPhoneNumber } = res.data;

        Cookies.set('accessToken', accessToken, { expires: 0.021 });
        dispatch(setUserFromToken(accessToken));

        router.push('/');
        // // 2. 조건부 리다이렉트 (핵심!)
        // if (hasPhoneNumber) {
        //   // 이미 전화번호가 있는 기존 회원이면 메인으로
        //   router.push('/');
        // } else {
        //   // 전화번호가 없는 신규/미인증 회원이면 인증 페이지로
        //   alert('추가 정보 입력이 필요합니다.');
        //   router.push('/auth/verify-phone');
        // }
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
