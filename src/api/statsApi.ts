import axiosInstance from './axiosInstance';

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
    `/api/academy/${academyId}/class/stats`
  );

  return res.data;
};
