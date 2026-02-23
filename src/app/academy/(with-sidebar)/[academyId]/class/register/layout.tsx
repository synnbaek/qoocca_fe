import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '신규 클래스 등록 | 쿠카페어',
  description: '학원의 새로운 수업(클래스)을 등록하고 관리하세요. 과목, 학년, 수업 시간 및 요일을 설정할 수 있습니다.',
  keywords: ['학원관리', '클래스등록', '수업관리', '쿠카페어', '학원운영'],
};

export default function ClassRegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
