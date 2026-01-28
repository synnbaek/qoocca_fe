'use client';

import axiosInstance from '@/api/axiosInstance';
import Input from '@/components/common/Input';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import styles from './ClassRegisterPage.module.css';
import Button from '@/components/common/Button';
import Select from '@/components/common/Select';

const DAYS = [
  { id: 'monday', label: '월' },
  { id: 'tuesday', label: '화' },
  { id: 'wednesday', label: '수' },
  { id: 'thursday', label: '목' },
  { id: 'friday', label: '금' },
  { id: 'saturday', label: '토' },
  { id: 'sunday', label: '일' },
];

export default function ClassRegisterPage() {
  const router = useRouter();
  const { academyId } = useParams();

  const [ageOptions, setAgeOptions] = useState<
    { id: number; ageCode: string }[]
  >([]);
  const [subjectOptions, setSubjectOptions] = useState<
    { id: number; detailSubject: string }[]
  >([]);

  const [selectedAgeId, setSelectedAgeId] = useState<number | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    className: '',
    startTime: '09:00',
    endTime: '18:00',
    monday: false,
    tuesday: false,
    wednesday: false,
    thursday: false,
    friday: false,
    saturday: false,
    sunday: false,
    price: '',
  });

  useEffect(() => {
    const fetchAgesSubjects = async () => {
      try {
        const [subRes, ageRes] = await Promise.all([
          axiosInstance.get(`/api/academy/${academyId}/subjects`),
          axiosInstance.get(`/api/academy/${academyId}/ages`),
        ]);
        setSubjectOptions(subRes.data || []);
        setAgeOptions(ageRes.data || []);
      } catch (err) {
        console.error('과목 로딩 실패:', err);
      }
    };

    if (academyId) fetchAgesSubjects();
  }, [academyId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. 요일 체크
    const hasDay = DAYS.some((day) => (formData as any)[day.id]);
    if (!hasDay) {
      toast.error('수업 요일을 최소 하나 이상 선택해주세요.');
      return;
    }

    if (!selectedAgeId || !selectedSubjectId) {
      toast.error('학년과 과목을 선택해주세요.');
      return;
    }

    try {
      await axiosInstance.post(`/api/academy/${academyId}/class`, {
        ...formData,
        ageId: selectedAgeId,
        subjectId: selectedSubjectId,
      });
      toast.success('클래스가 성공적으로 등록되었습니다.');
      router.push(`/academy/${academyId}`);
    } catch (err) {
      toast.error('등록 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backBtn}>
          &lt; 이전
        </button>
        <h1>신규 클래스 등록</h1>
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        <Input
          label="클래스 명"
          name="className"
          value={formData.className}
          onChange={handleChange}
          placeholder="ex) 초등 수학 심화반"
          required
        />

        <div className={styles.inputGroup}>
          <Select
            label="학년 구분"
            options={ageOptions.map((a) => ({ label: a.ageCode, value: a.id }))}
            value={selectedAgeId}
            onChange={(val) => setSelectedAgeId(Number(val))}
            placeholder="학년을 선택하세요"
          />
        </div>

        <div className={styles.inputGroup}>
          <Select
            label="과목"
            options={subjectOptions.map((s) => ({ label: s.detailSubject, value: s.id }))}
            value={selectedSubjectId}
            onChange={(val) => setSelectedSubjectId(Number(val))}
            placeholder="과목을 선택하세요"
          />
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.customLabel}>수업 요일</label>
          <div className={styles.dayContainer}>
            {DAYS.map((day) => (
              <label key={day.id} className={styles.dayItem}>
                <input
                  type="checkbox"
                  name={day.id}
                  checked={(formData as any)[day.id]}
                  onChange={handleChange}
                />
                <span>{day.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.row}>
          <Input
            label="시작 시간"
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
          />
          <Input
            label="종료 시간"
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
          />
        </div>

        <Input
          label="월 수업비"
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="ex) 200000"
        />

        <div className={styles.buttonWrapper}>
          <Button variant="primary" type="submit">
            등록하기
          </Button>
        </div>
      </form>
    </div>
  );
}
