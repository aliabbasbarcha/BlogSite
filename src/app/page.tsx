import Link from "next/link";

import { client } from "@/sanity/lib/client";
import { LATEST_POSTS_QUERY } from "@/sanity/lib/queries";
import { PostCard, type PostCardData } from "@/components/PostCard";

export const revalidate = 60;

const LATEST_POSTS_LIMIT = 3;

export default async function HomePage() {
  const posts = await client.fetch<PostCardData[]>(LATEST_POSTS_QUERY, {
    limit: LATEST_POSTS_LIMIT,
  });

  return (
    <>
      <section className="border-b border-gray-100 bg-gradient-to-b from-indigo-50 to-white">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
            Welcome to BlogSite
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Words that inform.
            <br />
            Stories that inspire.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg text-gray-600">
            A space for in-depth articles, practical guides, and honest
            perspectives.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/blog"
              prefetch={false}
              className="rounded-md bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Explore posts
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Latest posts
          </h2>
          {posts.length > 0 && (
            <Link
              href="/blog"
              prefetch={false}
              className="text-sm font-medium text-indigo-600 hover:underline"
            >
              View all posts →
            </Link>
          )}
        </div>

        {posts.length === 0 ? (
          <p className="mt-6 text-gray-500">
            No posts yet. Add some in the{" "}
            <Link href="/studio" prefetch={false} className="underline">
              Studio
            </Link>
            .
          </p>
        ) : (
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
