export function getSafeHttpUrl(value: string | null | undefined): string | null {
  if (!value) {
    return null;
  }

  try {
    const url = new URL(value);

    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

export function instagramHandleFromUrl(
  value: string | null | undefined,
): string | null {
  const href = getSafeHttpUrl(value);

  if (!href) {
    return null;
  }

  try {
    const handle = new URL(href).pathname.split("/").filter(Boolean)[0];
    return handle ? handle.replace(/^@/, "").toLowerCase().slice(0, 80) : null;
  } catch {
    return null;
  }
}
