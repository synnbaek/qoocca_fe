'use client';
import { useState } from 'react';
import styles from '../student.module.css';
import StudentClassRow from './StudentClassRow';


export interface StudentInfo {
    id: number;
    studentId: number;
    name: string;
    parentName: string;
    cardNumber: string;
}


export interface StudentClassRowType {
    id: number;
    className: string;
    totalStudents: number;
    inactiveStudents: number;
    isActive: boolean;
    students?: StudentInfo[];
}


interface Props {
    data: StudentClassRowType[];
}


export default function StudentCell({ data }: Props) {
    const [checkedRows, setCheckedRows] = useState<number[]>([]);


    const toggleAll = () => {
        if (checkedRows.length === data.length) {
            setCheckedRows([]);
        } else {
            setCheckedRows(data.map(r => r.id));
        }
    };


    const toggleRowCheck = (id: number) => {
        setCheckedRows(prev =>
            prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]
        );
    };


    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th className={styles.checkboxCol}>
                            <input
                                type="checkbox"
                                checked={checkedRows.length === data.length && data.length > 0}
                                onChange={toggleAll}
                            />
                        </th>
                        <th className={styles.classNameColHeader}>클래스명</th>
                        <th className={styles.statCol}>전체학생</th>
                        <th className={styles.statCol}>비활성화</th>
                        <th className={styles.statCol}>운영여부</th>
                    </tr>
                </thead>


                <tbody>
                    {data.map(row => (
                        <StudentClassRow
                            key={row.id}
                            row={row}
                            checked={checkedRows.includes(row.id)}
                            onCheck={() => toggleRowCheck(row.id)}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}