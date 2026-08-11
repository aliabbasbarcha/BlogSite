export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

export const siteName = "BlogSite";

export const siteDescription = "A blog built with Next.js and Sanity";

// Escapes "<" so a "</script>" inside CMS content can't break out of a
// JSON-LD <script> tag when injected via dangerouslySetInnerHTML.
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
