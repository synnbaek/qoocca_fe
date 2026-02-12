import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '원생 관리 | 쿠카페어',
  description: '학원의 원생 목록을 클래스별로 확인하고 관리하세요. 원생 등록, 보호자 연결 상태, 카드 등록 현황을 한눈에 파악할 수 있습니다.',
  keywords: ['원생관리', '학생부', '학원관리프로그램', '쿠카페어', '학부모연결', '카드등록'],
};

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
