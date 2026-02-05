import axiosInstance from './axiosInstance';

/**
 * 통계 분석 관련 API 엔드포인트
 */
export const ACADEMY_ENDPOINTS = {
  /** 클래스별 인원 통계 데이터 조회 */
  fetchClassStats: (academyId: string | number) => `/api/academy/${academyId}/analytics/class-stats`,
} as const;

/**
 * 클래스별 인원 통계 응답 구조
 */
export interface ClassStatsApiResponse {
  classId: number;        // 클래스 ID
  className: string;      // 클래스 이름
  totalStudents: number;  // 전체 원생 수
  withdrawnStudents: number; // 퇴원한 원생 수
}

/**
 * 학원의 전반적인 클래스별 원생 현황 통계 조회
 */
export const fetchClassStats = async (
  academyId: number
): Promise<ClassStatsApiResponse[]> => {
  const res = await axiosInstance.get(
    ACADEMY_ENDPOINTS.fetchClassStats(academyId)
  );

  return res.data;
};


