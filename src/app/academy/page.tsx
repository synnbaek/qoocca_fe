"use client";

import { useRouter } from "next/navigation";
import { useAcademy } from "../../context/AcademyContext";
import AcademyTitle from "../academy/components/AcademyTitle";
import TextInput from "../academy/components/TextInput";
import MultiFileInput from "../academy/components/MultiFileInput";
import styles from "./academy.module.css";
import Button from "../../components/common/Button";

export default function AcademyStartPage() {
  const router = useRouter();
  const { academyName, setAcademyName, businessFiles, setBusinessFiles } = useAcademy();

  return (
    <div className={styles.academyContainer}>
      <AcademyTitle title="학원 등록하기" />

      <div className={styles.sectionBox}>
        <TextInput
          label="학원명"
          value={academyName}
          onChange={setAcademyName}
        />
      </div>

      <div className={styles.sectionBox}>
        <MultiFileInput
          label="사업자 등록증 제출"
          files={businessFiles}
          onChange={setBusinessFiles}
        />
      </div>

      <div className={styles.sectionBox}>
        <Button
          disabled={!academyName || businessFiles.length === 0}
          onClick={() => router.push("/academy/form")}
        >
          다음
        </Button>
      </div>

    </div>
  );
}
