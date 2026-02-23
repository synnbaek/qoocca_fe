import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '학원 정보 수정 | 쿠카페어',
  description: '학원의 기본 정보, 학원생 나이, 과목, 이미지 등을 수정하고 업데이트하세요.',
  keywords: ['학원정보수정', '학원관리', '쿠카페어', '학원운영'],
};

export default function AcademyModifyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
