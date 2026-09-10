type NoticeProps = {
  children: React.ReactNode;
  tone?: "success" | "error";
};

export function Notice({ children, tone = "success" }: NoticeProps) {
  return (
    <p
      role="status"
      className={
        tone === "error"
          ? "border border-admin-danger px-3 py-2 text-sm text-admin-danger"
          : "border border-line bg-admin-fill px-3 py-2 text-sm"
      }
    >
      {children}
    </p>
  );
}
