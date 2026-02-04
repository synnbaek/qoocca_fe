'use client';
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
    isSearching?: boolean;
}


interface Props {
    data: StudentClassRowType[];
}


export default function StudentCell({ data }: Props) {
    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
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
                            isSearching={row.isSearching}
                        />

                    ))}
                </tbody>
            </table>
        </div>
    );
}