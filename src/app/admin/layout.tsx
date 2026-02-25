import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '관리자 센터 | 쿠카티처스',
  description: '쿠카티처스 학원 입점 및 서비스 관리를க்கான 관리자 전용 페이지입니다.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
