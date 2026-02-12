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
            <table className={styles.table} role="grid" aria-label="원생 목록">
                <thead role="rowgroup">
                    <tr role="row">
                        <th className={styles.classNameColHeader} role="columnheader">클래스명</th>
                        <th className={styles.statCol} role="columnheader">전체학생</th>
                        <th className={styles.statCol} role="columnheader">비활성화</th>
                        <th className={styles.statCol} role="columnheader">운영여부</th>
                    </tr>
                </thead>


                <tbody role="rowgroup">
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