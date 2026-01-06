'use client';

import { memo } from 'react';
import styles from './SocialLogin.module.css';
import { NaverIcon } from '@/components/icons/SocialIcons';

const NaverLogin = memo(function NaverLogin() {
  const NAVER_AUTH_LOGIN_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI}`;

  const handleNaverLogin = () => {
    window.location.href = NAVER_AUTH_LOGIN_URL;
  };

  return (
    <button
      type="button"
      onClick={handleNaverLogin}
      className={`${styles.customSocialBtn} ${styles.naver}`}
    >
      <NaverIcon />
      네이버 로그인
    </button>
  );
});

export default NaverLogin;
