import axiosInstance from "@/api/axiosInstance";

export type Age = {
  id: number;
  ageCode: string;
};

export const getAges = async (): Promise<Age[]> => {
  const res = await axiosInstance.get("/api/ages");
  return res.data;
};
