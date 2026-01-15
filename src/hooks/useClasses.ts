import { useState, useEffect } from 'react';
import { getClasses, ClassGetResponse } from '../api/classApi';

export function useClasses(academyId: number) {
    const [classes, setClasses] = useState<ClassGetResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!academyId) return;

        const fetchClasses = async () => {
            try {
                setLoading(true);
                const data = await getClasses(academyId);
                setClasses(data);
            } catch (err) {
                console.error('Failed to fetch classes:', err);
                setError('클래스 목록을 불러오는데 실패했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, [academyId]);

    return { classes, loading, error };
}
