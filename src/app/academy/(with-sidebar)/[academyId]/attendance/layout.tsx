import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '출결 현황 | 쿠카티처스',
  description: '학원의 실시간 등하원 출결 현황을 확인하고 관리합니다.',
  keywords: ['학원출결', '등원확인', '출석체크', '쿠카티처스', '학원운영관리'],
};

export default function AttendanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
