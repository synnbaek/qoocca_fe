type Props = {
  label: string;
  files: File[];
  onChange: (files: File[]) => void;
};

export default function MultiFileInput({ label, files, onChange }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    onChange(Array.from(e.target.files));
  };

  return (
    <div>
      <p style={{ fontWeight: 600, marginBottom: "8px" }}>{label}</p>

      {/* 숨겨진 파일 인풋 */}
      <input
        id="business-file"
        type="file"
        multiple
        onChange={handleChange}
        style={{ display: "none" }}
      />

      {/* 커스텀 버튼 */}
      <label htmlFor="business-file" style={{ cursor: "pointer" }}>
        <div
          style={{
            border: "1px dashed #ccc",
            borderRadius: "8px",
            padding: "20px",
            textAlign: "center",
          }}
        >
          {/* SVG 아이콘 */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 14.4238V17.0008C3 18.3815 4.11929 19.5008 5.5 19.5008H18.2692C19.6499 19.5008 20.7692 18.3815 20.7692 17.0008V14.4238"
              stroke="black"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6.80762 8.07696L11.8846 3M11.8846 3L16.9615 8.07696M11.8846 3V14.4231"
              stroke="black"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <p style={{ marginTop: "8px", fontSize: "14px" }}>
            파일 선택
          </p>
        </div>
      </label>

      {/* 선택된 파일 목록 */}
      {files.length > 0 && (
        <ul style={{ marginTop: "10px", fontSize: "14px" }}>
          {files.map((file, idx) => (
            <li key={idx}>{file.name}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
