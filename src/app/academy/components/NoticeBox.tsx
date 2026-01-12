export default function NoticeBox({ text }: { text: string }) {
  return (
    <div
      style={{
        background: "#f5f5f5",
        padding: "12px",
        fontSize: "14px",
        marginBottom: "16px",
      }}
    >
       {text}
    </div>
  );
}
