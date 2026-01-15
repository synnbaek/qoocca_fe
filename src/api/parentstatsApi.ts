import axiosInstance from './axiosInstance';

export interface ParentInfo {
  parentId: number;
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
    `/api/academy/${academyId}/class/parentstats`
  );

  return res.data;
};
