export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");

export const siteName = "BlogSite";

export const siteDescription = "A blog built with Next.js and Sanity";
