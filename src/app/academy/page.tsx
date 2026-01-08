"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AcademyTitle from "./components/AcademyTitle";
import TextInput from "./components/TextInput";
import MultiFileInput from "./components/MultiFileInput";
import styles from "./academy.module.css";

export default function AcademyStartPage() {
  const router = useRouter();
  const [academyName, setAcademyName] = useState("");
  const [businessFiles, setBusinessFiles] = useState<File[]>([]);

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


      {/* 파일 업로드 영역 */}
      <div className={styles.sectionBox}>
        <div className={styles.fileBox}>
          <MultiFileInput
            label="사업자 등록증 제출"
            files={businessFiles}
            onChange={setBusinessFiles}
          />
          <p className={styles.fileGuide}>
            사진 또는 캡처화면 제출 (png, jpg, pdf)
          </p>
        </div>
      </div>

      {/* 안내 영역 */}
      <div className={styles.sectionBox}>
        <div className={styles.noticeWrapper}>
          <div className={styles.noticeTitleRow}>
            <svg
              className={styles.noticeIcon}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 3
                   C7.029 3 3 7.029 3 12
                   C3 16.971 7.029 21 12 21
                   C16.971 21 21 16.971 21 12
                   C21 7.029 16.971 3 12 3Z"
                stroke="currentColor"
                strokeWidth="1.5"
                fill="none"
              />
              <line
                x1="12"
                y1="7"
                x2="12"
                y2="14"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <circle cx="12" cy="17" r="1" fill="currentColor" />
            </svg>

            <p className={styles.noticeTitle}>
              학원 관계자 확인을 위해 사업자등록증을 업로드해 주세요
            </p>
          </div>

          <ul className={styles.noticeSubList}>
            <li>제출된 사업자등록증은 학원 인증 용도로만 사용됩니다.</li>
            <li>인증 완료 전까지 일부 기능 이용이 제한될 수 있습니다.</li>
          </ul>
        </div>
      </div>

      {/* 다음 버튼 */}
      <div className={styles.sectionBox}>
        <button
          className={styles.nextButton}
          disabled={!academyName || businessFiles.length === 0}
          onClick={() => router.push("/academy/form")}
        >
          다음
        </button>
      </div>
    </div>
  );
}
