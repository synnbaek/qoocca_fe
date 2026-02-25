import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '학원 정보 수정 | 쿠카티처스',
  description: '학원의 기본 정보 및 운영 설정을 변경합니다.',
  keywords: ['학원정보수정', '학원관리', '쿠카티처스', '학원운영'],
};

export default function AcademyModifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
