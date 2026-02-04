import axios from "./axiosInstance";

export const ACADEMY_ENDPOINTS = {
  createAcademy: "/api/academy/registrations",
  getMyAcademyList: "/api/me/academies",
  getMyAcademyRegistration: "/api/me/academy-registration",
  getSubjects: (academyId: string | number) => `/api/academy/${academyId}/curriculum/subjects`,
  getAges: (academyId: string | number) => `/api/academy/${academyId}/curriculum/ages`,
} as const;

export interface AcademyCreatePayload {
  name: string;
  baseAddress: string;
  detailAddress?: string;
  briefInfo?: string;
  phoneNumber?: string;
  blogUrl?: string;
  websiteUrl?: string;
  instagramUrl?: string;
  certificateFile?: File;
  imageFiles?: File[];
  ageIds?: number[];
  subjects?: number[];
  detailInfo?: string;
}

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

export interface AcademyListResponse {
  academyId: number;
  name: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export const getMyAcademyList = async () => {
  const response = await axios.get<AcademyListResponse[]>(ACADEMY_ENDPOINTS.getMyAcademyList);
  return response.data;
};

export const getSubjects = async (academyId: string | number) => {
  const response = await axios.get(ACADEMY_ENDPOINTS.getSubjects(academyId));
  return response.data;
};

export const getAges = async (academyId: string | number) => {
  const response = await axios.get(ACADEMY_ENDPOINTS.getAges(academyId));
  return response.data;
};


