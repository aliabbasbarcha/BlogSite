import { notFound } from "next/navigation";
import { PortableText, type PortableTextBlock } from "next-sanity";
import Image from "next/image";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { POST_QUERY, POST_SLUGS_QUERY } from "@/sanity/lib/queries";

export const revalidate = 60;

type Post = {
  _id: string;
  title: string;
  excerpt?: string;
  mainImage?: import("sanity").Image;
  body?: PortableTextBlock[];
  publishedAt?: string;
  author?: { name: string };
};

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(POST_SLUGS_QUERY);
  return slugs.map((slug) => ({ slug }));
}

export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await client.fetch<Post | null>(POST_QUERY, { slug });

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight">{post.title}</h1>
      <div className="mt-2 text-sm text-gray-500">
        {post.author?.name && <span>{post.author.name}</span>}
        {post.publishedAt && (
          <time className="ml-2">
            {new Date(post.publishedAt).toLocaleDateString()}
          </time>
        )}
      </div>

      {post.mainImage && (
        <Image
          src={urlFor(post.mainImage).width(1200).height(600).url()}
          alt={post.title}
          width={1200}
          height={600}
          className="mt-6 w-full rounded-lg object-cover"
        />
      )}

      {post.body && (
        <div className="prose prose-gray mt-8 max-w-none">
          <PortableText value={post.body} />
        </div>
      )}
    </article>
  );
}
