'use client';

import axiosInstance from '@/api/axiosInstance';
import Input from '@/components/common/Input';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import styles from './ClassRegisterPage.module.css';
import Button from '@/components/common/Button';

const DAYS = [
  { id: 'monday', label: '월' },
  { id: 'tuesday', label: '화' },
  { id: 'wednesday', label: '수' },
  { id: 'thursday', label: '목' },
  { id: 'friday', label: '금' },
  { id: 'saturday', label: '토' },
  { id: 'sunday', label: '일' },
];

interface Subject {
  id: number;
  ageCode: string;
  mainSubjectCode: string;
  detailSubject: string;
}

export default function ClassRegisterPage() {
  const router = useRouter();
  const { academyId } = useParams();
  const [ages, setAges] = useState<Subject[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
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
    ageId: '',
    subjectId: '',
  });

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axiosInstance.get(
          `/api/academy/${academyId}/subjects`
        );
        setSubjects(res.data || []);
      } catch (err) {
        console.error('과목 로딩 실패:', err);
      }
    };

    if (academyId) fetchSubjects();
  }, [academyId]);

  useEffect(() => {
    const fetchAges = async () => {
      try {
        const res = await axiosInstance.get(`/api/academy/${academyId}/ages`);
        setAges(res.data || []);
      } catch (err) {
        console.error('나이 로딩 실패:', err);
      }
    };

    if (academyId) fetchAges();
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

    const hasDay = DAYS.some((day) => (formData as any)[day.id]);
    if (!hasDay) {
      alert('수업 요일을 최소 하나 이상 선택해주세요.');
      return;
    }

    try {
      await axiosInstance.post(`/api/academy/${academyId}/class`, formData);
      toast.success('클래스가 성공적으로 등록되었습니다.');
      router.push(`/${academyId}/dashboard`);
    } catch (err) {
      console.error('등록 실패:', err);
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
          <label className={styles.label}>학년 구분</label>
          <select
            name="ageId"
            value={formData.ageId}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">학년</option>
            {ages.map((age) => (
              <option key={age.id} value={age.id}>
                {age.ageCode}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>과목</label>
          <select
            name="subjectId"
            value={formData.subjectId}
            onChange={handleChange}
            className={styles.select}
            required
          >
            <option value="">과목</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.detailSubject}
              </option>
            ))}
          </select>
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
