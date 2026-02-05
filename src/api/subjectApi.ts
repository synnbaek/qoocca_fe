import axiosInstance from "@/api/axiosInstance";

/**
 * 전역 수강 과목 데이터 구조
 */
export type Subject = {
  id: number;                // 과목 ID
  mainSubjectCode: string;   // 메인 과목 코드 (예: MATH, ENGLISH 등)
  detailSubject: string;     // 세부 과목명
};

/**
 * 시스템에 등록된 전체 과목 목록 조회
 */
export const getSubjects = async (): Promise<Subject[]> => {
  const res = await axiosInstance.get<Subject[]>("/api/subjects");
  return res.data;
};
