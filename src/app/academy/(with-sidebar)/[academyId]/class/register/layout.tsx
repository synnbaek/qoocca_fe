import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '신규 클래스 등록 | 쿠카티처스',
  description: '학원의 새로운 클래스를 등록하고 수업 정보를 설정합니다.',
  keywords: ['학원관리', '클래스등록', '수업관리', '쿠카티처스', '학원운영'],
};

export default function ClassRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
