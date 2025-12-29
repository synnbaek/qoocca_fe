import Link from 'next/link';

export default function SignupSection() {
  return (
    <div className="signup-wrapper">
      <span>아직 회원이 아니신가요?</span>
      <Link href="/signup" className="signup-link-text">
        회원가입하기
      </Link>
    </div>
  );
}
