import axiosInstance from "@/api/axiosInstance";

/**
 * 수강 연령 데이터 구조
 */
export type Age = {
  id: number;      // 연령 ID
  ageCode: string; // 연령 코드 (예: ELEMENTARY, MIDDLE 등)
};

/**
 * 전역 연령 목록 조회
 */
export const getAges = async (): Promise<Age[]> => {
  const res = await axiosInstance.get("/api/ages");
  return res.data;
};
