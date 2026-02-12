import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '신규 원생 등록 | 쿠카페어',
  description: '학원의 신규 원생을 개별 또는 엑셀 일괄 업로드를 통해 쉽고 빠르게 등록하세요. 보호자 정보와 카드 등록까지 한번에 완료할 수 있습니다.',
  keywords: ['원생등록', '학원원생관리', '엑셀일괄등록', '쿠카페어', '학부모등록'],
};

export default function StudentFormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}