export function StatusBadge({ status }: { status: string }) {
  const base = "px-2 py-1 text-xs rounded-full font-medium";

  const styles =
    status === "new"
      ? "bg-blue-100 text-blue-700"
      : status === "contacted"
        ? "bg-yellow-100 text-yellow-700"
        : status === "qualified"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700";
  return <span className={`${base} ${styles}`}>{status}</span>;
}
