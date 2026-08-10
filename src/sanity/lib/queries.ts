import { defineQuery } from "next-sanity";

const POST_CARD_PROJECTION = `{
  _id,
  title,
  slug,
  excerpt,
  mainImage,
  publishedAt
}`;

export const LATEST_POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) [0...$limit] ${POST_CARD_PROJECTION}
`);

export const PAGINATED_POSTS_QUERY = defineQuery(`
  {
    "posts": *[_type == "post" && defined(slug.current)] | order(publishedAt desc) [$start...$end] ${POST_CARD_PROJECTION},
    "total": count(*[_type == "post" && defined(slug.current)])
  }
`);

export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    body,
    publishedAt,
    seo,
    "author": author->{name, image, bio},
    "categories": categories[]->{title}
  }
`);

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)][].slug.current
`);

export const COMMENTS_QUERY = defineQuery(`
  *[_type == "comment" && post._ref == $postId] | order(_createdAt asc) {
    _id,
    name,
    text,
    _createdAt
  }
`);

export const POSTS_INDEX_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    title,
    excerpt,
    "slug": slug.current,
    publishedAt,
    "updatedAt": _updatedAt
  }
`);
