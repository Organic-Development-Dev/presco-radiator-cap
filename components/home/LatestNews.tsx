import Link from "next/link";
import { SanityImage } from "@/components/SanityImage";
import type { PostCard } from "@/lib/types";

const dateFormat = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" });

/** Latest news cards. Horizontal scroll-snap row on mobile, grid from `sm` up. */
export function LatestNews({ posts, heading }: { posts: PostCard[]; heading?: string | null }) {
  if (!posts.length) return null;

  return (
    <section aria-labelledby="latest-news-heading" className="container-site py-10">
      <h2 id="latest-news-heading" className="pb-10 text-center text-[22px] font-bold uppercase text-accent">
        {heading || "Latest News"}
      </h2>
      <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:overflow-visible sm:px-0">
        {posts.map((post) => (
          <li key={post._id} className="w-4/5 shrink-0 snap-center sm:w-auto">
            <Link href={`/blog/${post.slug}/`} className="group block">
              <div className="relative aspect-[285/235] overflow-hidden rounded-2xl bg-surface">
                <SanityImage
                  image={post.mainImage}
                  alt=""
                  fallbackSrc="/img/latest-news.png"
                  fill
                  sizes="(min-width: 640px) 33vw, 80vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="rounded-2xl border border-white bg-primary px-4 py-1.5 text-sm text-white">
                    Read more
                  </span>
                </div>
              </div>
              <h3 className="mt-3 font-semibold text-ink group-hover:text-accent">{post.title}</h3>
              {post.publishedAt && (
                <time dateTime={post.publishedAt} className="text-xs text-gray-500">
                  {dateFormat.format(new Date(post.publishedAt))}
                </time>
              )}
            </Link>
          </li>
        ))}
      </ul>
      <div className="mt-8 text-center">
        <Link href="/news/" className="btn-outline">
          View all news
        </Link>
      </div>
    </section>
  );
}
