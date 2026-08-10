# BlogSite

A blog built with [Next.js](https://nextjs.org) (App Router), [Tailwind CSS](https://tailwindcss.com), and [Sanity](https://www.sanity.io) as the content backend. Content is managed through an embedded Sanity Studio at `/studio` — no separate admin app to run.

## Features

- Blog listing page and individual post pages, rendered from Sanity content
- Sanity Studio embedded at `/studio` for writing and editing posts
- Per-post SEO fields (meta title/description) with sensible fallbacks, `sitemap.xml`, `robots.txt`, and `llms.txt`
- A no-login comment system on each post (name + comment, no account required)
- Custom SVG favicon and logo

## Requirements

- [Node.js](https://nodejs.org) 20+
- A [Sanity](https://www.sanity.io) account (free tier is fine)

## Getting started

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example env file and fill in your Sanity project details:

   ```bash
   cp .env.local.example .env.local
   ```

   | Variable | Description |
   | --- | --- |
   | `NEXT_PUBLIC_SANITY_PROJECT_ID` | Your Sanity project ID (from [sanity.io/manage](https://sanity.io/manage) or `npx sanity projects list`) |
   | `NEXT_PUBLIC_SANITY_DATASET` | Usually `production` |
   | `NEXT_PUBLIC_SANITY_API_VERSION` | Sanity API version, e.g. `2024-01-01` |
   | `NEXT_PUBLIC_SITE_URL` | Public URL of the site (used in the sitemap, robots.txt, and SEO tags). Use `http://localhost:3000` locally |
   | `SANITY_API_READ_TOKEN` | A Sanity API token with **Editor** permissions, used server-side to save comments. Not needed for writing posts in the Studio — that just needs you to be logged into your Sanity account in the browser. Create one at `sanity.io/manage` → your project → API → Tokens |

   If you don't have a Sanity project yet, run `npx sanity@latest init` in this folder and follow the prompts — it will create one and fill in the project ID/dataset for you.

3. Start the dev server:

   ```bash
   npm run dev
   ```

   - Site: [http://localhost:3000](http://localhost:3000)
   - Studio (content editor): [http://localhost:3000/studio](http://localhost:3000/studio)

## Content model

Defined in [`src/sanity/schemaTypes`](src/sanity/schemaTypes):

- **post** — title, slug, author, main image, categories, excerpt, body (rich text with inline images), SEO fields
- **author** — name, slug, image, bio
- **category** — title, description
- **comment** — name, comment text, reference to a post. Comments are created via a server action and publish immediately with no approval step; moderate by deleting unwanted ones from the Studio.

## Project structure

```
src/app/                   Routes (App Router)
  page.tsx                 Blog listing (home page)
  blog/[slug]/page.tsx     Post page (content + comments)
  blog/[slug]/actions.ts   Server action that saves a new comment
  studio/[[...tool]]/      Embedded Sanity Studio
  sitemap.ts, robots.ts    Generated SEO files
  llms.txt/route.ts        Generated llms.txt
src/sanity/
  schemaTypes/             Content model
  lib/                     Sanity clients and GROQ queries
```

## Deployment

Deploys cleanly to [Vercel](https://vercel.com/new): set the same environment variables from `.env.local` in the project settings (with `NEXT_PUBLIC_SITE_URL` set to your production domain), then deploy. In your Sanity project's API settings, add your production URL to **CORS origins**.

## Learn more

- [Next.js documentation](https://nextjs.org/docs)
- [Sanity documentation](https://www.sanity.io/docs)
