interface StatusMessageProps {
  message: string;
  tone?: "error" | "info";
}

export function StatusMessage({ message, tone = "info" }: StatusMessageProps) {
  return (
    <div className={`status-message ${tone}`}>
      <strong>{tone === "error" ? "שימי לב" : "עדכון"}</strong>
      <span>{message}</span>
    </div>
  );
}
