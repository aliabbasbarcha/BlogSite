import Link from "next/link";
import Image from "next/image";

import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import { POSTS_QUERY } from "@/sanity/lib/queries";

export const revalidate = 60;

type Post = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: import("sanity").Image;
  publishedAt?: string;
};

export default async function HomePage() {
  const posts = await client.fetch<Post[]>(POSTS_QUERY);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Latest posts</h1>

      {posts.length === 0 && (
        <p className="mt-6 text-gray-500">
          No posts yet. Add some in the{" "}
          <Link href="/studio" className="underline">
            Studio
          </Link>
          .
        </p>
      )}

      <ul className="mt-8 flex flex-col gap-8">
        {posts.map((post) => (
          <li key={post._id} className="border-b border-gray-100 pb-8">
            <Link href={`/blog/${post.slug.current}`} className="group">
              {post.mainImage && (
                <Image
                  src={urlForImage(post.mainImage).width(800).height(400).url()}
                  alt={post.title}
                  width={800}
                  height={400}
                  className="mb-4 h-48 w-full rounded-lg object-cover"
                />
              )}
              <h2 className="text-xl font-semibold group-hover:underline">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="mt-2 text-gray-600">{post.excerpt}</p>
              )}
              {post.publishedAt && (
                <time className="mt-2 block text-sm text-gray-400">
                  {new Date(post.publishedAt).toLocaleDateString()}
                </time>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
