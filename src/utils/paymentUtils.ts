export const getPaymentStatusLabel = (status: string) => {
  switch (status) {
    case 'BEFORE_REQUEST':
      return '결제 요청 전';
    case 'ISSUED':
      return '결제 대기 중';
    case 'PAID':
      return '수납 완료';
    default:
      return status;
  }
};