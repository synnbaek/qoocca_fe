'use client';


import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from '../student.module.css';
import { StudentClassRowType } from './StudentCell';


interface Props {
    row: StudentClassRowType;
    checked: boolean;
    onCheck: () => void;
}


export default function StudentClassRow({ row, checked, onCheck }: Props) {
    const params = useParams();
    const router = useRouter();
    const academyId = params.academyId;

    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(row.isActive);


    const students = row.students ?? [];


    return (
        <>
            <tr className={checked ? styles.selectedRow : undefined}>
                <td className={styles.td}>
                    <input type="checkbox" checked={checked} onChange={onCheck} />
                </td>
                <td
                    className={`${styles.td} ${styles.classNameCell}`}
                    onClick={() => setOpen(prev => !prev)}
                >
                    {row.className}
                </td>
                <td className={styles.td}>{row.totalStudents}</td>
                <td className={styles.td}>{row.inactiveStudents}</td>
                <td className={`${styles.td} ${styles.statusCell}`}>
                    <div className={styles.toggleWrapper} onClick={() => setActive(prev => !prev)}>
                        <span className={styles.toggleLabel}>
                            {active ? '운영중' : '종료'}
                        </span>

                        <div
                            className={`${styles.toggleSwitch} ${active ? styles.toggleOn : styles.toggleOff}`}
                        >
                            <div className={styles.toggleKnob} />
                        </div>
                    </div>


                </td>
            </tr>


            {open && (
                <tr className={styles.detailRow}>
                    <td colSpan={5}>
                        {students.length === 0 ? (
                            <div className={styles.noStudents}>학생 정보가 없습니다.</div>
                        ) : (
                            <div className={styles.fakeTable}>
                                {students.map(student => (
                                    <div
                                        key={student.id}
                                        className={styles.fakeRow}
                                        onClick={() => router.push(`/academy/${academyId}/student/${student.studentId}`)}
                                    >
                                        <div></div> {/* 체크박스 자리 */}

                                        <div>{student.name}</div>

                                        <div>
                                            {student.parentName === '보호자 연결' ? (
                                                <span className={styles.linkHint}>{student.parentName}</span>
                                            ) : (
                                                student.parentName
                                            )}
                                        </div>

                                        <div>
                                            {student.cardNumber.includes('등록') ? (
                                                <span className={styles.linkHint}>{student.cardNumber}</span>
                                            ) : (
                                                student.cardNumber
                                            )}
                                        </div>

                                        <div></div> {/* 운영상태 자리 */}
                                    </div>
                                ))}

                            </div>
                        )}
                    </td>
                </tr>
            )}

        </>
    );
}