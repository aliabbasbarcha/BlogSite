import type { Metadata } from "next";

import { client } from "@/sanity/lib/client";
import { PAGINATED_POSTS_QUERY } from "@/sanity/lib/queries";
import { PostCard, type PostCardData } from "@/components/PostCard";
import { Pagination } from "@/components/Pagination";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description: "All posts.",
};

const PAGE_SIZE = 6;

export default async function BlogIndexPage({
  searchParams,
}: PageProps<"/blog">) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const { posts, total } = await client.fetch<{
    posts: PostCardData[];
    total: number;
  }>(PAGINATED_POSTS_QUERY, { start, end });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight text-white">Blog</h1>

      {posts.length === 0 ? (
        <p className="mt-6 text-gray-400">No posts found on this page.</p>
      ) : (
        <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} basePath="/blog" />
    </div>
  );
}
