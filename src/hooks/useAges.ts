"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";

export type Age = {
  id: number;
  ageCode: string;
};

export const useAges = () => {
  const [ageOptions, setAgeOptions] = useState<{ label: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAges = async () => {
      try {
        const res = await axiosInstance.get<Age[]>("/api/ages");
        setAgeOptions(res.data.map(a => ({ label: a.ageCode, value: a.id })));
      } catch (err) {
        console.error("나이 정보 불러오기 실패", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAges();
  }, []);

  return { ageOptions, loading };
};