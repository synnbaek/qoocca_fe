import axiosInstance from "@/api/axiosInstance";

export type Subject = {
  id: number;
  mainSubjectCode: string;
  detailSubject: string;
};

export const getSubjects = async (): Promise<Subject[]> => {
  const res = await axiosInstance.get<Subject[]>("/api/subjects");
  return res.data;
};
