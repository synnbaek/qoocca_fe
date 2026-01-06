'use client';

import { memo } from 'react';
import styles from './SocialLogin.module.css';
import { KakaoIcon } from '@/components/icons/SocialIcons';

const KakaoLogin = memo(function KakaoLogin() {
  const KAKAO_AUTH_LOGIN_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;

  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_LOGIN_URL;
  };

  return (
    <button
      type="button"
      onClick={handleKakaoLogin}
      className={`${styles.customSocialBtn} ${styles.kakao}`}
    >
      <KakaoIcon />
      카카오 로그인
    </button>
  );
});

export default KakaoLogin;
