"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/api/axiosInstance";

export type Subject = {
  id: number;
  mainSubjectCode: string;
  detailSubject: string;
};

export const useSubjects = () => {
  const [subjectOptions, setSubjectOptions] = useState<{ label: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axiosInstance.get<Subject[]>("/api/subjects");
        setSubjectOptions(res.data.map(s => ({ label: s.detailSubject, value: s.id })));
      } catch (err) {
        console.error("과목 정보 불러오기 실패", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  return { subjectOptions, loading };
};