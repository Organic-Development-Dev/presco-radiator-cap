import type { Metadata } from "next";
import { cache } from "react";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { LatestNews } from "@/components/home/LatestNews";
import { Testimonials } from "@/components/home/Testimonials";
import { RichText } from "@/components/RichText";
import { buildMetadata } from "@/lib/metadata";
import { SITE_NAME } from "@/lib/site";
import type { Page, PostCard } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PAGE_QUERY, POSTS_QUERY } from "@/sanity/lib/queries";

const getHomePage = cache(async (): Promise<Page | null> => {
  try {
    return await sanityFetch<Page | null>({ query: PAGE_QUERY, params: { slug: "home" }, tags: ["page"] });
  } catch (error) {
    console.error("Home: failed to load page content", error);
    return null;
  }
});

async function getLatestPosts(): Promise<PostCard[]> {
  try {
    return (await sanityFetch<PostCard[]>({ query: POSTS_QUERY, params: { limit: 3 }, tags: ["post"] })) ?? [];
  } catch (error) {
    console.error("Home: failed to load latest posts", error);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage();
  const metadata = buildMetadata({ title: SITE_NAME, seo: page?.seo, path: "/" });
  // The home page title shouldn't get the "| Presco Radiator Caps" suffix.
  return { ...metadata, title: { absolute: page?.seo?.title || SITE_NAME } };
}

export default async function HomePage() {
  const [page, posts] = await Promise.all([getHomePage(), getLatestPosts()]);

  return (
    <>
      <h1 className="sr-only">{page?.title && page.title.toLowerCase() !== "home" ? page.title : SITE_NAME}</h1>
      <HeroCarousel />
      {page?.body?.length ? (
        <section className="container-site overflow-hidden py-6">
          <RichText value={page.body} />
        </section>
      ) : null}
      <LatestNews posts={posts} />
      <Testimonials />
    </>
  );
}
