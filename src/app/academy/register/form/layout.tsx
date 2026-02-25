import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '상세 정보 입력 | 학원 등록 | 쿠카티처스',
  description: '학원의 상세 정보를 입력하여 등록을 완료해 주세요.',
};

export default function RegisterFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
