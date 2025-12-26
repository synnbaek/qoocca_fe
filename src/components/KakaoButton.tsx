import KakaoIcon from './KaKaoIcon';

export default function KakaoButton() {
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
}
