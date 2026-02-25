import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '수납 관리 | 쿠카티처스',
  description: '학원의 수강료 수납 현황을 관리하고 미납 내역을 추적합니다.',
  keywords: ['학원수강료', '결제관리', '미납관리', '학원비결제', '쿠카티처스'],
};

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
