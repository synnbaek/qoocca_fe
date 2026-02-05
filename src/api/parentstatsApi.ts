import axiosInstance from './axiosInstance';

/**
 * 학부모 관련 분석 API 엔드포인트
 */
export const ACADEMY_ENDPOINTS = {
  /** 학원별 원생/학부모 결합 통계 데이터 조회 */
  getParentStats: (academyId: string | number) => `/api/academy/${academyId}/analytics/parent-stats`,
} as const;

/**
 * 학부모 개별 정보 구조
 */
export interface ParentInfo {
  parentId: number;           // 학부모 ID
  parentName: string;         // 학부모 이름
  cardNum: string;           // 등록된 카드 번호 (보통 뒷자리만)
  cardState: boolean;         // 카드 유효 상태
  parentRelationship: string; // 원생과의 관계
  parentPhone: string;       // 학부모 연락처
  isPay: boolean;            // 수납 대상 여부
  alarm: boolean;            // 알림 구독 여부
}

/**
 * 원생별 보호자 정보 포함 구조
 */
export interface StudentParentInfo {
  studentId: number;
  studentName: string;
  studentPhone: string;
  status: 'ENROLLED' | 'PAUSED' | 'WITHDRAWN'; // 원생 상태
  parents: ParentInfo[]; // 해당 원생의 보호자 목록 (최대 2명)
}

/**
 * 클래스별 원생/보호자 통계 구조
 */
export interface ClassParentStats {
  classId: number;
  className: string;
  students: StudentParentInfo[]; // 해당 클래스에 속한 원생 목록
}

/**
 * 학원의 전체 클래스별 원생 및 보호자 통합 데이터 조회
 */
export const fetchParentStats = async (
  academyId: number
): Promise<ClassParentStats[]> => {
  const res = await axiosInstance.get(
    ACADEMY_ENDPOINTS.getParentStats(academyId)
  );

  return res.data;
};
