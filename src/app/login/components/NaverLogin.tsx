import { memo } from 'react';

const NaverIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M13.51 10.215L6.49 0H0V20H6.49V9.785L13.51 20H20V0H13.51V10.215Z" />
  </svg>
);

const NaverLogin = memo(function NaverLogin() {
  const NAVER_AUTH_LOGIN_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI}`;

  const handleNaverLogin = () => {
    window.location.href = NAVER_AUTH_LOGIN_URL;
  };

  return (
    <button
      type="button"
      className="custom-social-btn naver"
      onClick={handleNaverLogin}
    >
      <NaverIcon />
      <span>네이버 로그인</span>
    </button>
  );
});

export default NaverLogin;
