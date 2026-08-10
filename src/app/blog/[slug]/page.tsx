import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";
import Image from "next/image";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { POST_QUERY, POST_SLUGS_QUERY } from "@/sanity/lib/queries";

export const revalidate = 60;

type SanityImage = import("sanity").Image & { alt?: string };

type Post = {
  _id: string;
  title: string;
  excerpt?: string;
  mainImage?: SanityImage;
  body?: PortableTextBlock[];
  publishedAt?: string;
  author?: { name: string };
  seo?: { metaTitle?: string; metaDescription?: string };
};

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }: { value: SanityImage }) => (
      <Image
        src={urlFor(value).width(1200).height(675).url()}
        alt={value.alt || ""}
        width={1200}
        height={675}
        className="rounded-lg object-cover"
      />
    ),
  },
};

export async function generateStaticParams() {
  const slugs = await client.fetch<string[]>(POST_SLUGS_QUERY);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await client.fetch<Post | null>(POST_QUERY, { slug });

  if (!post) {
    return {};
  }

  const title = post.seo?.metaTitle || post.title;
  const description = post.seo?.metaDescription || post.excerpt;
  const ogImage = post.mainImage
    ? [{ url: urlFor(post.mainImage).width(1200).height(630).url() }]
    : undefined;

  return {
    title,
    description,
    openGraph: { title, description, images: ogImage },
    twitter: { card: "summary_large_image", title, description, images: ogImage },
  };
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
          alt={post.mainImage.alt || post.title}
          width={1200}
          height={600}
          className="mt-6 w-full rounded-lg object-cover"
        />
      )}

      {post.body && (
        <div className="prose prose-gray mt-8 max-w-none">
          <PortableText value={post.body} components={portableTextComponents} />
        </div>
      )}
    </article>
  );
}
