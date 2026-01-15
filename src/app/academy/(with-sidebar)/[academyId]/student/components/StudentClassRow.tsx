'use client';


import { useState } from 'react';
import styles from '../student.module.css';
import { StudentClassRowType } from './StudentCell';


interface Props {
row: StudentClassRowType;
checked: boolean;
onCheck: () => void;
}


export default function StudentClassRow({ row, checked, onCheck }: Props) {
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
<td className={styles.td}>
<button
className={active ? styles.statusActive : styles.statusInactive}
onClick={() => setActive(prev => !prev)}
>
{active ? '운영중' : '종료'}
</button>
</td>
</tr>


{open && (
<tr className={styles.detailRow}>
<td colSpan={5}>
{students.length === 0 ? (
<div className={styles.noStudents}>학생 정보가 없습니다.</div>
) : (
<table className={styles.innerTable}>
<thead>
<tr>
<th>학생명</th>
<th>보호자</th>
<th>카드번호</th>
</tr>
</thead>
<tbody>
{students.map(student => (
<tr key={student.id}>
<td>{student.name}</td>
<td>{student.parentName}</td>
<td>{student.cardNumber}</td>
</tr>
))}
</tbody>
</table>
)}
</td>
</tr>
)}
</>
);
}