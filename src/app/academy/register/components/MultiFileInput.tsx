import { useRef } from 'react';
import styles from './MultiFileInput.module.css';

type Props = {
  label: string;
  description?: string;
  files: File[];
  onChange: (files: File[]) => void;
  multiple?: boolean;
};

export default function MultiFileInput({ label, description, files, onChange, multiple = false }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);

    if (multiple) {
      // 다중 파일 모드: 기존 파일에 추가
      onChange([...files, ...newFiles]);
    } else {
      // 단일 파일 모드: 기존 동작 유지
      onChange(newFiles);
    }
  };

  const handleContainerClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  return (
    <div>
      <input
        ref={fileInputRef}
        id="business-file"
        type="file"
        accept="image/*,.pdf"
        multiple={multiple}
        onChange={handleChange}
        style={{ display: "none" }}
      />

      <div className={styles.container} onClick={handleContainerClick}>
        <div className={styles.textSection}>
          <div className={styles.label}>{label}</div>
          {description && <div className={styles.description}>{description}</div>}
        </div>

        {!multiple && (
          <div className={styles.previewSection}>
            {files.length > 0 ? (
              (() => {
                const previewUrl = URL.createObjectURL(files[0]);
                const isImage = files[0].type.startsWith('image/');
                return isImage ? (
                  <img src={previewUrl} alt="Preview" className={styles.previewImage} />
                ) : (
                  <div className={styles.fileIcon}>PDF</div>
                );
              })()
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
        )}
      </div>

      {multiple && files.length > 0 && (
        <div className={styles.imageGrid}>
          {files.map((file, index) => {
            const previewUrl = URL.createObjectURL(file);
            const isImage = file.type.startsWith('image/');
            return (
              <div key={index} className={styles.imageItem}>
                {isImage ? (
                  <img src={previewUrl} alt={`Preview ${index + 1}`} className={styles.gridImage} />
                ) : (
                  <div className={styles.gridFileIcon}>PDF</div>
                )}
                <button
                  type="button"
                  className={styles.removeBtn}
                  onClick={(e) => handleRemoveFile(index, e)}
                  aria-label="이미지 삭제"
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}