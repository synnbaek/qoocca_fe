import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '등록 신청 완료 | 쿠카티처스',
  description: '학원 등록 신청이 완료되었습니다. 관리자 승인 후 원생 및 결제 관리가 가능합니다.',
};

export default function RegisterCompleteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
