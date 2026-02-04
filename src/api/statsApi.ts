import axiosInstance from './axiosInstance';

export const ACADEMY_ENDPOINTS = {
  fetchClassStats: (academyId: string | number) => `/api/academy/${academyId}/analytics/class-stats`,
} as const;

export interface ClassStatsApiResponse {
  classId: number;
  className: string;
  totalStudents: number;
  withdrawnStudents: number;
}

export const fetchClassStats = async (
  academyId: number
): Promise<ClassStatsApiResponse[]> => {
  const res = await axiosInstance.get(
    ACADEMY_ENDPOINTS.fetchClassStats(academyId)
  );

  return res.data;
};


