"use client";

import { useRouter } from "next/navigation";
import styles from './complete.module.css';
import AcademyTitle from "../components/AcademyTitle";

export default function AcademyCompletePage() {
  const router = useRouter();

  return (
    <div className={styles.completeContainer}>
      <div className={styles.titleWrapper}>
        <AcademyTitle title="학원 등록 완료" />
      </div>

      <div className={styles.sectionBox}>
        <p className={styles.completeTitle}>학원 등록이 완료되었습니다.</p>
        <p className={styles.completeTitle}>
          관리자 승인까지 1~3일 정도 소요될 수 있습니다.
        </p>
        <p className={styles.completeText}>
          승인 완료 후 출결, 수업 관리, 수납 관리 등 모든 기능을 이용하실 수 있습니다.
        </p>
      </div>

      <div className={styles.sectionBox}>
        <button
          className={styles.nextButton}
          onClick={() => router.push("/")}
        >
          확인
        </button>
      </div>
    </div>
  );
}
