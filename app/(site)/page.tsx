import type { Metadata } from "next";
import { cache } from "react";
import { HeroCarousel, type CarouselSlide } from "@/components/home/HeroCarousel";
import { Features, ProductTiles } from "@/components/home/HomeSections";
import { LatestNews } from "@/components/home/LatestNews";
import { Testimonials } from "@/components/home/Testimonials";
import { RichText } from "@/components/RichText";
import { SiteJsonLd } from "@/components/SiteJsonLd";
import { resolveHref } from "@/lib/links";
import { getLocalePages, languageAlternates } from "@/lib/localePages";
import { buildMetadata } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/settings";
import { SITE_NAME } from "@/lib/site";
import type { HomePage as HomePageData, PostCard, Testimonial } from "@/lib/types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlFor } from "@/sanity/lib/image";
import { HOME_PAGE_QUERY, POSTS_QUERY } from "@/sanity/lib/queries";

const getHomePage = cache(async (): Promise<HomePageData> => {
  try {
    return await sanityFetch<HomePageData>({ query: HOME_PAGE_QUERY, tags: ["homePage", "testimonial"] });
  } catch (error) {
    console.error("Home: failed to load homepage content", error);
    return null;
  }
});

async function getLatestPosts(): Promise<PostCard[]> {
  try {
    return (await sanityFetch<PostCard[]>({ query: POSTS_QUERY, params: { limit: 4 }, tags: ["post"] })) ?? [];
  } catch (error) {
    console.error("Home: failed to load latest posts", error);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings, localePages] = await Promise.all([getHomePage(), getSiteSettings(), getLocalePages()]);
  const siteName = settings?.siteName || SITE_NAME;
  return buildMetadata({
    // The homepage title is used as-is (no "| Presco Radiator Caps" suffix).
    title: page?.seo?.title || siteName,
    absoluteTitle: true,
    seo: page?.seo,
    path: "/",
    languages: languageAlternates(localePages),
  });
}

export default async function HomePage() {
  const [page, posts, settings] = await Promise.all([getHomePage(), getLatestPosts(), getSiteSettings()]);

  const slides: CarouselSlide[] = (page?.heroSlides ?? []).map((slide) => ({
    key: slide._key,
    src: urlFor(slide.image).width(2000).height(800).fit("crop").url(),
    // Phones: the dedicated phone image if there is one, otherwise the wide banner cropped around its hotspot.
    mobileSrc: urlFor(slide.mobileImage?.asset ? slide.mobileImage : slide.image)
      .width(1200)
      .height(720)
      .fit("crop")
      .url(),
    alt: slide.image.alt ?? "",
    href: resolveHref(slide),
    blurDataURL: slide.image.lqip,
  }));
  const testimonials = (page?.testimonials ?? []).filter((t): t is Testimonial => Boolean(t?.quote));

  return (
    <>
      <h1 className="sr-only">{page?.heading || settings?.siteName || SITE_NAME}</h1>
      <HeroCarousel slides={slides} />
      <Features heading={page?.featuresHeading} items={page?.features ?? []} />
      <ProductTiles heading={page?.productsHeading} tiles={page?.productTiles ?? []} />
      {page?.intro?.length ? (
        <section className="container-site overflow-hidden py-6">
          <RichText value={page.intro} />
        </section>
      ) : null}
      <LatestNews posts={posts} heading={page?.newsHeading} />
      <Testimonials
        heading={page?.testimonialsHeading}
        subheading={page?.testimonialsSubheading}
        testimonials={testimonials}
      />
      <SiteJsonLd settings={settings} />
    </>
  );
}
