import axiosInstance from './axiosInstance';

export const ACADEMY_ENDPOINTS = {
  getParentStats: (academyId: string | number) => `/api/academy/${academyId}/analytics/parent-stats`,
} as const;

export interface ParentInfo {
  parentId: number;
  parentName: string;
  cardNum: string;
  cardState: boolean;
  parentRelationship: string;
  parentPhone: string;
  isPay: boolean;
  alarm: boolean;
}

export interface StudentParentInfo {
  studentId: number;
  studentName: string;
  studentPhone: string; // Added studentPhone
  status: 'ENROLLED' | 'PAUSED' | 'WITHDRAWN'; // Added status
  parents: ParentInfo[];
}

export interface ClassParentStats {
  classId: number;
  className: string;
  students: StudentParentInfo[];
}

export const fetchParentStats = async (
  academyId: number
): Promise<ClassParentStats[]> => {
  const res = await axiosInstance.get(
    ACADEMY_ENDPOINTS.getParentStats(academyId)
  );

  return res.data;
};
