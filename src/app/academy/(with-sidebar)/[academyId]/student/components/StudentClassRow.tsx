'use client';


import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from '../student.module.css';
import { StudentClassRowType } from './StudentCell';


interface Props {
    row: StudentClassRowType;
    isSearching?: boolean;
}


export default function StudentClassRow({ row, isSearching }: Props) {
    const params = useParams();
    const router = useRouter();
    const academyId = params.academyId;

    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(row.isActive);

    useEffect(() => {
        if (isSearching) {
            setOpen(true);
        }
    }, [isSearching]);



    const students = row.students ?? [];


    return (
        <>
            <tr 
                className={`${styles.mainRow} ${open ? styles.expanded : ''}`}
                onClick={() => setOpen(prev => !prev)}
            >
                <td className={styles.classNameCell}>
                    {row.className}
                </td>
                <td>{row.totalStudents}</td>
                <td>{row.inactiveStudents}</td>
                <td>
                    <span className={`${styles.statusBadge} ${active ? styles.statusActive : styles.statusInactive}`}>
                        {active ? '운영중' : '종료'}
                    </span>
                </td>
            </tr>

            {open && (
                <>
                    {students.length === 0 ? (
                        <tr>
                            <td colSpan={4} className={styles.noStudents}>
                                학생 정보가 없습니다.
                            </td>
                        </tr>
                    ) : (
                        students.map(student => (
                            <tr 
                                key={student.id} 
                                className={styles.studentRow}
                                onClick={() => router.push(`/academy/${academyId}/student/${student.studentId}`)}
                                style={{ cursor: 'pointer' }}
                            >
                                <td className={styles.studentNameCell}>
                                    <div className={styles.studentNameWrapper}>
                                        <span className={styles.subArrow}>↳</span>
                                        <span className={styles.studentNameText}>{student.name}</span>
                                    </div>
                                </td>
                                <td className={styles.studentParentCell}>
                                    {student.parentName === '보호자 연결' ? (
                                        <span className={styles.linkHint}>{student.parentName}</span>
                                    ) : (
                                        student.parentName
                                    )}
                                </td>
                                <td className={styles.studentCardCell}>
                                    {student.cardNumber.includes('등록') ? (
                                        <span className={styles.linkHint}>{student.cardNumber}</span>
                                    ) : (
                                        student.cardNumber
                                    )}
                                </td>
                                <td></td> {/* empty cell for Status column */}

                            </tr>
                        ))
                    )}
                </>
            )}
        </>
    );
}