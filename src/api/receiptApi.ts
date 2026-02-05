import axiosInstance from './axiosInstance';

/**
 * 영수증 생성 요청 데이터 구조
 */
export interface ReceiptCreateRequest {
  classId: number;        // 연관된 클래스 ID
  amount: number;         // 수납할 금액
  receiptDate?: string;   // 영수증 발행(예정) 날짜
  receiptStatus?: 'BEFORE_REQUEST' | 'ISSUED' | 'PAID'; // 영수증 상태
}

/**
 * 특정 원생에 대한 새로운 영수증(수납 요청) 생성
 */
export const createReceipt = async (
  studentId: number,
  payload: ReceiptCreateRequest
) => {
  const response = await axiosInstance.post(
    `/api/student/${studentId}/receipt`,
    payload
  );
  return response.data;
};
