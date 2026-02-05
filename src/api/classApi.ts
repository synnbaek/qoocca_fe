import axiosInstance from "@/api/axiosInstance";

/**
 * 학원 클래스(반) 관련 API 엔드포인트
 */
export const ACADEMY_ENDPOINTS = {
    /** 특정 학원의 클래스 목록 조회 */
    getClassList: (academyId: number | string) => `/api/academy/${academyId}/class`,
    /** 특정 학원에 새로운 클래스 생성 */
    createClass: (academyId: number | string) => `/api/academy/${academyId}/class`,
} as const;

/**
 * 학원 클래스 정보 응답 구조
 */
export interface ClassGetResponse {
    classId: number;      // 클래스 ID
    className: string;    // 클래스 이름
    startTime: string;    // 수업 시작 시간
    endTime: string;      // 수업 종료 시간
    monday: boolean;      // 월요일 수업 여부
    tuesday: boolean;     // 화요일 수업 여부
    wednesday: boolean;   // 수요일 수업 여부
    thursday: boolean;    // 목요일 수업 여부
    friday: boolean;      // 금요일 수업 여부
    saturday: boolean;    // 토요일 수업 여부
    sunday: boolean;      // 일요일 수업 여부
    price: string;        // 수강료
    ageCode: string;      // 대상 연령 코드
    subjectName: string;  // 과목 이름
}

/**
 * 특정 학원의 모든 클래스 목록 조회
 */
export const getClasses = async (academyId: number): Promise<ClassGetResponse[]> => {
    const response = await axiosInstance.get<ClassGetResponse[]>(ACADEMY_ENDPOINTS.getClassList(academyId));
    return response.data;
};

/**
 * 신규 클래스 등록
 */
export const createClass = async (academyId: string | number, data: any): Promise<void> => {
    await axiosInstance.post(ACADEMY_ENDPOINTS.createClass(academyId), data);
};


