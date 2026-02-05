'use client';

import { useState, useEffect } from 'react';
import { getStudents, AcademyStudentResponse } from '@/api/studentApi';

/**
 * 학원의 모든 원생 목록을 조회하는 커스텀 훅
 */
export function useAcademyStudents(academyId: number) {
    const [students, setStudents] = useState<AcademyStudentResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!academyId) return;

        const fetchStudents = async () => {
            try {
                setLoading(true);
                const data = await getStudents(academyId);
                setStudents(data);
            } catch (err) {
                console.error('Failed to fetch academy students:', err);
                setError('원생 목록을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [academyId]);

    const refresh = async () => {
        const data = await getStudents(academyId);
        setStudents(data);
    };

    return { students, loading, error, refresh };
}
