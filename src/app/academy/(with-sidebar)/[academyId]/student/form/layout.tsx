import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '신규 원생 등록 | 쿠카티처스',
  description: '학원의 새로운 원생 정보를 등록하고 학부모를 연결합니다.',
  keywords: ['원생등록', '학원원생관리', '엑셀일괄등록', '쿠카티처스', '학부모등록'],
};

export default function StudentFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}