import React from 'react';
import styles from '../ClassAttendancePage.module.css';

interface StudentMonthlyStat {
    studentId: number;
    studentName: string;
    presentCount: number;
    lateCount: number;
    absentCount: number;
}

interface Props {
  student: StudentMonthlyStat;
  isSelected: boolean;
  onSelectStudent: (id: number) => void;
  onClick: () => void;
}

export default function StudentAttendanceRow({
  student,
  isSelected,
  onSelectStudent,
  onClick,
}: Props) {
  return (
    <tr className={styles.studentRow}>
      <td>
        <input
          type="checkbox"
          onChange={() => onSelectStudent(student.studentId)}
          checked={isSelected}
        />
      </td>
      <td className={styles.studentName} onClick={onClick}>{student.studentName}</td>
      <td className={styles.present}>{student.presentCount}</td>
      <td className={styles.late}>{student.lateCount}</td>
      <td className={styles.absent}>{student.absentCount}</td>
    </tr>
  );
}
