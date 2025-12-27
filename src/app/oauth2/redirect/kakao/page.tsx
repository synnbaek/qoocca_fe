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
          { code }
        );

        // 1. 휴대폰 인증이 필요한 경우 (신규 소셜 가입 혹은 번호 미등록)
        if (res.data.accessToken === 'NEED_PHONE_AUTH') {
          // 백엔드에서 refreshToken 필드에 담아준 socialId를 꺼냄
          const socialId = res.data.refreshToken;

          if (!socialId) {
            throw new Error('소셜 식별 정보(socialId)가 없습니다.');
          }

          alert('추가 휴대폰 인증이 필요합니다.');
          // socialId를 쿼리 스트링으로 안전하게 전달
          router.push(`/social-auth?socialId=${encodeURIComponent(socialId)}`);
        }
        // 2. 정상 로그인 성공
        else {
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
          '카카오 로그인 에러 상세:',
          err.response?.data || err.message
        );
        alert('로그인 처리 중 오류가 발생했습니다.');
        router.push('/login');
      }
    };

    if (code) getToken();
  }, [code, dispatch, router]);

  return <div>카카오 로그인 처리 중...</div>;
}

export default function OAuthRedirectKakaoPage() {
  return (
    <Suspense fallback={<div>로그인 인증 중입니다...</div>}>
      <KakaoHandler />
    </Suspense>
  );
}
