"use client";

import { useEffect, useState } from "react";
import { getAges, Age } from "@/api/ageApi";

export const useAges = () => {
  const [ages, setAges] = useState<Age[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAges = async () => {
      try {
        const data = await getAges();
        setAges(data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchAges();
  }, []);

  /** 🔥 UI에서 바로 쓰는 값 */
  const ageOptions = ages.map((age) => age.ageCode);

  return { ageOptions, loading, error };
};
