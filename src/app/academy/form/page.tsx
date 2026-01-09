"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AcademyTitle from "../components/AcademyTitle";
import TextInput from "../components/TextInput";
import MultiSelect from "../components/MultiSelect";
import styles from "./form.module.css";
import { useSubjects } from "@/hooks/useSubjects";
import { useAges } from "@/hooks/useAges";
import { createAcademy } from "@/api/academyApi";
import { useAcademy } from "@/context/AcademyContext";

export default function AcademyFormPage() {
  const router = useRouter();
  const { academyName, businessFiles } = useAcademy();

  const { subjectOptions, loading: subjectLoading } = useSubjects();
  const { ageOptions, loading: ageLoading } = useAges();

  const [baseAddress, setBaseAddress] = useState("");
  const [detailAddress, setDetailAddress] = useState("");
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

  // 선택한 문자열 → id 배열
  const selectedAgeIds = ages
    .map(label => ageOptions.find(a => a.label === label)?.value)
    .filter((v): v is number => v !== undefined);

  const selectedSubjectIds = subjects
    .map(label => subjectOptions.find(s => s.label === label)?.value)
    .filter((v): v is number => v !== undefined);

  const handleRegister = async () => {
    if (!academyName || businessFiles.length === 0) {
      alert("학원명과 사업자등록증을 먼저 입력해주세요.");
      return;
    }

    try {
      await createAcademy({
        name: academyName,
        baseAddress,
        detailAddress,
        phoneNumber: phone,
        briefInfo: intro,
        websiteUrl: website,
        instagramUrl: instagram,
        blogUrl: blog,
        certificateFile: businessFiles[0],
        ageIds: selectedAgeIds,
        subjects: selectedSubjectIds,
      });
      router.push("/academy/complete");
    } catch (err) {
      console.error(err);
      alert("학원 등록 중 오류가 발생했습니다.");
    }
  };

  if (ageLoading || subjectLoading) return <div>로딩 중...</div>;

  return (
    <div className={styles.formContainer}>
      <AcademyTitle title="학원 정보 입력" />

      <TextInput label="기본 주소" value={baseAddress} onChange={setBaseAddress} />
      <TextInput label="상세 주소" value={detailAddress} onChange={setDetailAddress} />
      <TextInput label="전화번호" value={phone} onChange={setPhone} />

      <MultiSelect
        label="학원생 나이"
        options={ageOptions.map(a => a.label)}
        selected={ages}
        onChange={setAges}
      />

      <MultiSelect
        label="과목"
        options={subjectOptions.map(s => s.label)}
        selected={subjects}
        onChange={setSubjects}
      />

      <TextInput label="학원 소개글(선택)" value={intro} onChange={setIntro} />
      <TextInput label="운영 시간(선택)" value={operatingHours} onChange={setOperatingHours} />
      <TextInput label="수업 비용(선택)" value={tuition} onChange={setTuition} />
      <TextInput label="레벨 테스트(선택)" value={levelTest} onChange={setLevelTest} />
      <TextInput label="홈페이지" value={website} onChange={setWebsite} />
      <TextInput label="인스타그램" value={instagram} onChange={setInstagram} />
      <TextInput label="네이버 블로그" value={blog} onChange={setBlog} />

      <div className={styles.sectionBox}>
        <button
          className={styles.nextButton}
          onClick={handleRegister}
          disabled={!academyName || businessFiles.length === 0}
        >
          등록하기
        </button>
      </div>
    </div>
  );
}
