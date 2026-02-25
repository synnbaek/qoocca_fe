import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '클래스 출결 현황 | 쿠카티처스',
  description: '클래스별 상세 출결 기록을 확인하고 관리합니다.',
};

export default function ClassAttendanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
