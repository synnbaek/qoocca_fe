import axios from "./axiosInstance";

/**
 * 학원 관련 API 엔드포인트 상수
 */
export const ACADEMY_ENDPOINTS = {
  /** 학원 등록 신청 */
  createAcademy: "/api/academy/registrations",
  /** 내 학원 목록 조회 */
  getMyAcademyList: "/api/me/academies",
  /** 내 학원 등록 상태 조회 */
  getMyAcademyRegistration: "/api/me/academy-registration",
  /** 학원별 수강 과목 목록 조회 */
  getSubjects: (academyId: string | number) => `/api/academy/${academyId}/curriculum/subjects`,
  /** 학원별 수강 연령 목록 조회 */
  getAges: (academyId: string | number) => `/api/academy/${academyId}/curriculum/ages`,
} as const;

/**
 * 학원 생성 요청 데이터 구조
 */
export interface AcademyCreatePayload {
  name: string;              // 학원 이름
  baseAddress: string;       // 기본 주소
  detailAddress?: string;    // 상세 주소
  briefInfo?: string;        // 한 줄 소개
  phoneNumber?: string;      // 전화번호
  blogUrl?: string;          // 블로그 URL
  websiteUrl?: string;       // 웹사이트 URL
  instagramUrl?: string;     // 인스타그램 URL
  certificateFile?: File;    // 사업자등록증 파일
  imageFiles?: File[];       // 학원 사진 파일들
  ageIds?: number[];         // 수강 연령 ID 목록
  subjects?: number[];       // 수강 과목 ID 목록
  detailInfo?: string;       // 상세 설명
}

/**
 * 학원 등록 신청 함수
 */
export const createAcademy = async (payload: AcademyCreatePayload) => {
  const formData = new FormData();

  formData.append("name", payload.name);
  formData.append("baseAddress", payload.baseAddress);
  if (payload.detailAddress) formData.append("detailAddress", payload.detailAddress);
  if (payload.briefInfo) formData.append("briefInfo", payload.briefInfo);
  if (payload.phoneNumber) formData.append("phoneNumber", payload.phoneNumber);
  if (payload.blogUrl) formData.append("blogUrl", payload.blogUrl);
  if (payload.websiteUrl) formData.append("websiteUrl", payload.websiteUrl);
  if (payload.instagramUrl) formData.append("instagramUrl", payload.instagramUrl);
  if (payload.certificateFile) formData.append("certificateFile", payload.certificateFile);
  if (payload.imageFiles) {
    payload.imageFiles.forEach(file => formData.append("imageFiles", file));
  }
  if (payload.ageIds) payload.ageIds.forEach(id => formData.append("ageIds", String(id)));
  if (payload.subjects) payload.subjects.forEach(id => formData.append("subjects", String(id)));
  if (payload.detailInfo) formData.append("detailInfo", payload.detailInfo);

  const response = await axios.post(ACADEMY_ENDPOINTS.createAcademy, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data; // 등록된 학원 ID 반환
};

/**
 * 내 학원 목록 응답 구조
 */
export interface AcademyListResponse {
  academyId: number;
  name: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'; // 승인 상태 (대기/승인/거절)
}

/**
 * 내가 가입된 학원 목록 조회 함수
 */
export const getMyAcademyList = async () => {
  const response = await axios.get<AcademyListResponse[]>(ACADEMY_ENDPOINTS.getMyAcademyList);
  return response.data;
};

/**
 * 특정 학원의 수강 과목 목록 조회
 */
export const getSubjects = async (academyId: string | number) => {
  const response = await axios.get(ACADEMY_ENDPOINTS.getSubjects(academyId));
  return response.data;
};

/**
 * 특정 학원의 수강 연령 목록 조회
 */
export const getAges = async (academyId: string | number) => {
  const response = await axios.get(ACADEMY_ENDPOINTS.getAges(academyId));
  return response.data;
};


