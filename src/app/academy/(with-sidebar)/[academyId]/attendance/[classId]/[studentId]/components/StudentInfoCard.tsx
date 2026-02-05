import styles from '../StudentDetailPage.module.css';

interface StudentInfoCardProps {
    studentName?: string;
    enrolledClasses?: string[];
}

export default function StudentInfoCard({ studentName, enrolledClasses }: StudentInfoCardProps) {
    return (
        <div className={styles.studentInfoHeader}>
            <div className={styles.studentInfoLeft}>
                <span className={styles.studentName}>{studentName}</span>
                <div className={styles.classTags}>
                    {enrolledClasses?.map((tag, index) => (
                        <span key={index} className={styles.classTag}>{tag}</span>
                    ))}
                </div>
            </div>
            <button className={styles.editBtn}>정보 수정</button>
        </div>
    );
}