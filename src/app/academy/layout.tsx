// app/academy/layout.tsx
import styles from "./academyLayout.module.css";

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.academyWrapper}>
      <div className={styles.academyContainer}>
        {children}
      </div>
    </div>
  );
}
