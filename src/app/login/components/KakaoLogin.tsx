import { memo } from 'react';

function KakaoIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 3C6.477 3 2 6.483 2 10.771C2 13.545 3.825 15.982 6.574 17.382L5.412 21.662C5.352 21.884 5.604 22.062 5.792 21.936L10.848 18.544C11.226 18.575 11.609 18.591 12 18.591C17.523 18.591 22 15.108 22 10.82C22 6.532 17.523 3.05 12 3.05V3Z" />
    </svg>
  );
}

const KakaoLogin = memo(function KakaoLogin() {
  const KAKAO_AUTH_LOGIN_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;

  const handleKakaoLogin = () => {
    window.location.href = KAKAO_AUTH_LOGIN_URL;
  };

  return (
    <button
      type="button"
      className="custom-social-btn kakao"
      onClick={handleKakaoLogin}
    >
      <KakaoIcon />
      <span>카카오 로그인</span>
    </button>
  );
});

export default KakaoLogin;
