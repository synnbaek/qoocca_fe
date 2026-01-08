"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AcademyTitle from "../components/AcademyTitle";
import TextInput from "../components/TextInput";
import MultiSelect from "../components/MultiSelect";
import styles from "./form.module.css";

export default function AcademyFormPage() {
  const router = useRouter();

  // 상태값 분리
  const [address, setAddress]=useState("");
  const [phone, setPhone] = useState("");
  const [ages, setAges] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [intro, setIntro] = useState("");
  const [operatingHours, setOperatingHours] = useState("");
  const [tuition, setTuition] = useState("");
  const [levelTest, setLevelTest] = useState("");
  const [website, setWebsite] = useState("");
  const [instagram, setInstagram] = useState("");
  const [blog, setBlog] = useState("");

  
  return (
    <div className={styles.formContainer}>
      <div className={styles.titleWrapper}>
        <AcademyTitle title="학원 정보 입력" />
      </div>

    <div className={styles.sectionBox}>
        <TextInput label="주소" value={address} onChange={setAddress} />
      </div>

      <div className={styles.sectionBox}>
        <TextInput label="전화번호" value={phone} onChange={setPhone} />
      </div>

      <div className={styles.sectionBox}>
        <MultiSelect
          label="학원생 나이"
          options={["초등학생", "중학생", "고등학생", "성인"]}
          selected={ages}
          onChange={setAges}
        />
      </div>

      <div className={styles.sectionBox}>
        <MultiSelect
          label="과목"
          options={["수학", "영어", "국어", "과학", "코딩"]}
          selected={subjects}
          onChange={setSubjects}
        />
      </div>

      <div className={styles.sectionBox}>
        <TextInput label="학원 소개글(선택)" value={intro} onChange={setIntro} />
      </div>

      <div className={styles.sectionBox}>
        <TextInput
          label="운영 시간(선택)"
          value={operatingHours}
          onChange={setOperatingHours}
        />
      </div>

      <div className={styles.sectionBox}>
        <TextInput
          label="수업 비용(선택)"
          value={tuition}
          onChange={setTuition}
        />
      </div>

      <div className={styles.sectionBox}>
        <TextInput
          label="레벨 테스트(선택)"
          value={levelTest}
          onChange={setLevelTest}
        />
      </div>

      <div className={styles.sectionBox}>
        <TextInput label="홈페이지" value={website} onChange={setWebsite} />
      </div>

      <div className={styles.sectionBox}>
        <TextInput
          label="인스타그램"
          value={instagram}
          onChange={setInstagram}
        />
      </div>

      <div className={styles.sectionBox}>
        <TextInput label="네이버 블로그" value={blog} onChange={setBlog} />
      </div>

      <div className={styles.sectionBox}>
        <button
          className={styles.nextButton}
          onClick={() => router.push("/academy/complete")}
        >
          등록하기
        </button>
      </div>
    </div>
  );
}
