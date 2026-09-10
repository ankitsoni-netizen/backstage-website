function withHttps(host: string): URL {
  return new URL(host.includes("://") ? host : `https://${host}`);
}

export function getMetadataBaseUrl(): URL {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (siteUrl) {
    try {
      return new URL(siteUrl);
    } catch {
      // Fall through to platform defaults.
    }
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return withHttps(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  }

  if (process.env.VERCEL_URL) {
    return withHttps(process.env.VERCEL_URL);
  }

  return new URL("http://localhost:3000");
}
