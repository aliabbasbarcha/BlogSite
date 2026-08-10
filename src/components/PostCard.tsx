import Image from "next/image";
import Link from "next/link";

import { urlFor } from "@/sanity/lib/image";

export type PostCardData = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  mainImage?: (import("sanity").Image & { alt?: string }) | null;
  publishedAt?: string;
};

export function PostCard({ post }: { post: PostCardData }) {
  return (
    <Link
      href={`/blog/${post.slug.current}`}
      prefetch={false}
      className="group flex flex-col overflow-hidden rounded-lg border border-gray-100"
    >
      {post.mainImage ? (
        <Image
          src={urlFor(post.mainImage).width(800).height(450).url()}
          alt={post.mainImage.alt || post.title}
          width={800}
          height={450}
          className="h-44 w-full object-cover"
        />
      ) : (
        <div className="h-44 w-full bg-gradient-to-br from-indigo-100 to-violet-100" />
      )}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:underline">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-2 line-clamp-3 text-sm text-gray-600">{post.excerpt}</p>
        )}
        {post.publishedAt && (
          <time className="mt-4 text-xs text-gray-400">
            {new Date(post.publishedAt).toLocaleDateString()}
          </time>
        )}
      </div>
    </Link>
  );
}
