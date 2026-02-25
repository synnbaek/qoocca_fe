import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '원생 출결 기록 | 쿠카티처스',
  description: '원생의 월별 출결 기록 및 상세 상태를 확인합니다.',
};

export default function StudentAttendanceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
