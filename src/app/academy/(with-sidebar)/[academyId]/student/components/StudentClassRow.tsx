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
            <tr 
                className={`${styles.mainRow} ${checked ? styles.selectedRow : ''} ${open ? styles.expanded : ''}`}
                onClick={() => setOpen(prev => !prev)}
            >
                <td onClick={(e) => e.stopPropagation()}>
                    <input 
                        type="checkbox" 
                        checked={checked} 
                        onChange={onCheck} 
                    />
                </td>
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
                            <td colSpan={5} className={styles.noStudents}>
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
                                <td className={styles.subIconCol}>
                                  <span className={styles.subArrow}>↳</span>
                                </td>
                                <td colSpan={4}>
                                    <div className={styles.studentInfoWrapper}>
                                        <div className={styles.studentName}>{student.name}</div>
                                        
                                        <div className={styles.studentDetail}>
                                            <div className={styles.infoCell}>
                                                {student.parentName === '보호자 연결' ? (
                                                    <span className={styles.linkHint}>{student.parentName}</span>
                                                ) : (
                                                    student.parentName
                                                )}
                                            </div>
                                            <div className={styles.infoCell}>
                                                {student.cardNumber.includes('등록') ? (
                                                    <span className={styles.linkHint}>{student.cardNumber}</span>
                                                ) : (
                                                    student.cardNumber
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </>
            )}
        </>
    );
}