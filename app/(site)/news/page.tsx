import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PostCard } from "@/components/content/PostCard";
import { buildMetadata } from "@/lib/metadata";
import type { PostCard as PostCardType } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { POSTS_QUERY } from "@/sanity/lib/queries";

export const metadata: Metadata = buildMetadata({
  title: "News",
  path: "/news/",
  fallbackDescription: "News and updates from Presco Radiator Caps, UK manufacturer of radiator and expansion tank caps.",
});

export default async function NewsPage() {
  const posts = await sanityFetch<PostCardType[]>({ query: POSTS_QUERY, params: { limit: 50 }, tags: ["post"] });

  return (
    <>
      <Breadcrumbs items={[{ label: "News" }]} />
      <div className="container-site py-10 sm:py-16">
        <h1 className="heading-section mb-8">News</h1>
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
