import styles from "./authLayout.module.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.authWrapper}>
      <div className={styles.authContainer}>{children}</div>
    </div>
  );
}