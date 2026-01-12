import axios from "./axiosInstance";

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

  const response = await axios.post("/api/academy/register", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data; // 등록된 학원 ID 반환
};
