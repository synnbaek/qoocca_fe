import { useRef } from 'react';
import styles from './MultiFileInput.module.css';

type Props = {
  label: string;
  description?: string;
  files: File[];
  onChange: (files: File[]) => void;
};

export default function MultiFileInput({ label, description, files, onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    onChange(Array.from(e.target.files));
  };

  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  const previewUrl = files.length > 0 ? URL.createObjectURL(files[0]) : null;
  const isImage = files.length > 0 && files[0].type.startsWith('image/');

  return (
    <div>
      <input
        ref={fileInputRef}
        id="business-file"
        type="file"
        accept="image/*,.pdf"
        multiple={false}
        onChange={handleChange}
        style={{ display: "none" }}
      />

      <div className={styles.container} onClick={handleContainerClick}>
        <div className={styles.textSection}>
          <div className={styles.label}>{label}</div>
          {description && <div className={styles.description}>{description}</div>}
        </div>

        <div className={styles.previewSection}>
          {files.length > 0 ? (
            isImage && previewUrl ? (
              <img src={previewUrl} alt="Preview" className={styles.previewImage} />
            ) : (
              <div className={styles.fileIcon}>PDF</div>
            )
          ) : (
            <div className={styles.uploadIcon}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M17 8L12 3L7 8"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 3V15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}