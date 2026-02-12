import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '출결 현황 | 쿠카페어',
  description: '학원의 전체 클래스별 등원, 지각, 결석 현황을 실시간으로 확인하세요. 날짜별 조회와 클래스 검색이 가능합니다.',
  keywords: ['학원출결', '등원확인', '출석체크', '쿠카페어', '학원운영관리'],
};

export default function AttendanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
