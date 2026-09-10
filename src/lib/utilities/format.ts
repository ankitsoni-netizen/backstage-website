export function formatFollowerCount(count: number): string {
  if (!Number.isFinite(count) || count < 0) {
    return "";
  }

  if (count >= 1_000_000) {
    const millions = count / 1_000_000;
    return `${trimTrailingZero(millions)}M`;
  }

  if (count >= 1_000) {
    const thousands = count / 1_000;
    return `${trimTrailingZero(thousands)}K`;
  }

  return new Intl.NumberFormat("en-IN").format(count);
}

export function formatAdminDate(value: string | null | undefined): string {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function trimTrailingZero(value: number): string {
  return value
    .toFixed(1)
    .replace(/\.0$/, "");
}
