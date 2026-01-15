import axiosInstance from './axiosInstance';

export interface ReceiptCreateRequest {
  classId: number;
  amount: number;
  receiptDate?: string;
  receiptStatus?: 'BEFORE_REQUEST' | 'ISSUED' | 'PAID';
}

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
