'use client';

import { memo } from 'react';
import socialStyles from './SocialLogin.module.css';
import SocialButton from './SocialButton';
import { KakaoIcon, NaverIcon } from '@/components/icons/SocialIcons';

const SocialSection = memo(function SocialSection() {
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;
  const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI}`;

  return (
    <div className={socialStyles.socialSection}>
      <SocialButton
        provider="kakao"
        label="카카오 로그인"
        icon={<KakaoIcon />}
        authUrl={KAKAO_AUTH_URL}
      />
      <SocialButton
        provider="naver"
        label="네이버 로그인"
        icon={<NaverIcon />}
        authUrl={NAVER_AUTH_URL}
      />
    </div>
  );
});

export default SocialSection;
