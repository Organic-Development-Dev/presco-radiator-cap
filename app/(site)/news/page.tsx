import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PostCard } from "@/components/content/PostCard";
import { RichText } from "@/components/RichText";
import { buildMetadata } from "@/lib/metadata";
import { getPage } from "@/lib/pages";
import type { PostCard as PostCardType } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { POSTS_QUERY } from "@/sanity/lib/queries";

const SLUG = "news";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage(SLUG);
  return buildMetadata({ title: page?.title ?? "News", seo: page?.seo, path: `/${SLUG}/`, fallbackDescription: page?.intro });
}

export default async function NewsPage() {
  const [page, posts] = await Promise.all([
    getPage(SLUG),
    sanityFetch<PostCardType[]>({ query: POSTS_QUERY, params: { limit: 50 }, tags: ["post"] }),
  ]);
  const title = page?.title ?? "News";

  return (
    <>
      <Breadcrumbs items={[{ label: title }]} />
      <div className="container-site py-10 sm:py-16">
        <header className="mb-8">
          <h1 className="heading-section">{title}</h1>
          {page?.intro && <p className="mt-2 max-w-3xl text-gray-600">{page.intro}</p>}
        </header>
        <RichText value={page?.body} className="mb-8" />
        {posts.length ? (
          <ul className="space-y-10 sm:space-y-12">
            {posts.map((post) => (
              <li key={post._id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        ) : (
          <p>There are no news posts yet. Please check back soon.</p>
        )}
      </div>
    </>
  );
}
