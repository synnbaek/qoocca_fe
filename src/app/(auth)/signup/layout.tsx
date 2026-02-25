import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '회원가입 | 쿠카티처스',
  description: '쿠카티처스에 가입하고 학원 서비스를 이용해 보세요.',
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
