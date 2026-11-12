import type { Metadata } from "next";
import { cache } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { PostDate } from "@/components/content/PostDate";
import { RichText } from "@/components/RichText";
import { SanityImage } from "@/components/SanityImage";
import { ORGANIZATION_ID } from "@/components/SiteJsonLd";
import { buildMetadata } from "@/lib/metadata";
import { getPage } from "@/lib/pages";
import { truncate } from "@/lib/text";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import type { Post } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { POST_NEIGHBOURS_QUERY, POST_QUERY, POST_SLUGS_QUERY } from "@/sanity/lib/queries";

type Props = { params: Promise<{ slug: string }> };
type PostLink = { title: string; slug: string } | null;
type Neighbours = { newer: PostLink; older: PostLink } | null;

const getPost = cache((slug: string) => sanityFetch<Post | null>({ query: POST_QUERY, params: { slug }, tags: ["post"] }));

export async function generateStaticParams() {
  const posts = await sanityFetch<{ slug: string }[]>({ query: POST_SLUGS_QUERY, tags: ["post"] });
  return posts.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return buildMetadata({
    title: post.title,
    seo: post.seo,
    path: `/blog/${post.slug}/`,
    fallbackDescription: post.excerpt,
    fallbackImage: post.mainImage,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post._updatedAt,
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const [post, neighbours, newsPage] = await Promise.all([
    getPost(slug),
    sanityFetch<Neighbours>({ query: POST_NEIGHBOURS_QUERY, params: { slug }, tags: ["post"] }),
    getPage("news"),
  ]);
  const newsTitle = newsPage?.title ?? "News";
  if (!post) notFound();

  const url = `${SITE_URL}/blog/${post.slug}/`;
  const image = post.mainImage?.asset ? urlFor(post.mainImage).width(1200).url() : undefined;

  return (
    <>
      <Breadcrumbs items={[{ label: newsTitle, href: "/news/" }, { label: post.title }]} />
      <article className="container-site py-10 sm:py-16">
        <div className="mx-auto max-w-3xl">
          <header className="mb-8 text-center">
            <h1 className="text-2xl font-extrabold text-primary sm:text-3xl">{post.title}</h1>
            <PostDate date={post.publishedAt} className="mt-2 block text-sm text-gray-500" />
          </header>

          {post.mainImage?.asset && (
            <SanityImage
              image={post.mainImage}
              width={768}
              priority
              sizes="(min-width: 800px) 768px, 100vw"
              className="mb-8 h-auto w-full rounded-lg"
            />
          )}

          <RichText value={post.body} />

          {(neighbours?.newer || neighbours?.older) && (
            <nav aria-label="More news" className="mt-12 grid gap-6 border-t border-gray-200 pt-8 sm:grid-cols-2">
              {neighbours?.older ? (
                <Link href={`/blog/${neighbours.older.slug}/`} className="group">
                  <span className="block text-sm text-gray-500">Previous post</span>
                  <span className="font-semibold text-primary group-hover:underline">{neighbours.older.title}</span>
                </Link>
              ) : (
                <span />
              )}
              {neighbours?.newer && (
                <Link href={`/blog/${neighbours.newer.slug}/`} className="group sm:text-right">
                  <span className="block text-sm text-gray-500">Next post</span>
                  <span className="font-semibold text-primary group-hover:underline">{neighbours.newer.title}</span>
                </Link>
              )}
            </nav>
          )}

          <p className="mt-10 text-center">
            <Link href="/news/" className="btn-outline">
              &larr; Back to news
            </Link>
          </p>
        </div>
      </article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          ...(post.seo?.description || post.excerpt ? { description: truncate(post.seo?.description || post.excerpt) } : {}),
          ...(image ? { image: [image] } : {}),
          datePublished: post.publishedAt,
          ...(post._updatedAt ? { dateModified: post._updatedAt } : {}),
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          url,
          author: { "@type": "Organization", "@id": ORGANIZATION_ID, name: SITE_NAME, url: `${SITE_URL}/` },
          publisher: {
            "@type": "Organization",
            "@id": ORGANIZATION_ID,
            name: SITE_NAME,
            logo: { "@type": "ImageObject", url: `${SITE_URL}/img/logo.png` },
          },
        }}
      />
    </>
  );
}
