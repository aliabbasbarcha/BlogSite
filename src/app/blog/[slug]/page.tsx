import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";
import Image from "next/image";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { writeClient } from "@/sanity/lib/writeClient";
import { COMMENTS_QUERY, POST_QUERY, POST_SLUGS_QUERY } from "@/sanity/lib/queries";

import { CommentForm } from "./CommentForm";

export const revalidate = 60;

type Comment = {
  _id: string;
  name: string;
  text: string;
  _createdAt: string;
};

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
  marks: {
    link: ({ value, children }) => {
      const href: string = value?.href || "";
      const isExternal = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          className="text-indigo-600 underline underline-offset-2 hover:text-indigo-500"
          {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
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

  const comments = await writeClient.fetch<Comment[]>(COMMENTS_QUERY, {
    postId: post._id,
  });

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

      <section className="mt-16 border-t border-gray-200 pt-8">
        <h2 className="text-xl font-semibold">
          Comments{comments.length > 0 && ` (${comments.length})`}
        </h2>

        <ul className="mt-6 flex flex-col gap-6">
          {comments.map((comment) => (
            <li key={comment._id} className="border-b border-gray-100 pb-6">
              <div className="flex items-baseline justify-between">
                <span className="font-medium text-gray-900">{comment.name}</span>
                <time className="text-xs text-gray-400">
                  {new Date(comment._createdAt).toLocaleDateString()}
                </time>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-gray-700">{comment.text}</p>
            </li>
          ))}
        </ul>

        <CommentForm postId={post._id} slug={slug} />
      </section>
    </article>
  );
}
