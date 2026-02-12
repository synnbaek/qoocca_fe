import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '수납 관리 | 쿠카페어',
  description: '학원의 수강료 결제 및 미납 현황을 관리하세요. 클래스별 일괄 결제 요청 및 개별 수납 확인이 가능합니다.',
  keywords: ['학원수강료', '결제관리', '미납관리', '학원비결제', '쿠카페어'],
};

export default function PaymentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
