import Link from "next/link";
import { SanityImage } from "@/components/SanityImage";
import type { PostCard as PostCardType } from "@/lib/types";
import { PostDate } from "./PostDate";

/** News list item: image left on desktop, stacked on mobile. The whole card is one link. */
export function PostCard({ post }: { post: PostCardType }) {
  const href = `/blog/${post.slug}/`;
  return (
    <article className="group relative grid gap-4 md:grid-cols-3 md:gap-6">
      <div className="relative aspect-[361/207] overflow-hidden rounded-lg bg-surface">
        <SanityImage
          image={post.mainImage}
          fallbackSrc="/img/background-gray.png"
          alt=""
          fill
          sizes="(min-width: 768px) 33vw, 100vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="md:col-span-2">
        <PostDate date={post.publishedAt} className="text-xs text-gray-500" />
        <h2 className="mt-1 text-lg font-bold uppercase text-accent sm:text-xl">
          <Link href={href} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h2>
        {post.excerpt && <p className="mt-2 line-clamp-3 text-sm leading-relaxed">{post.excerpt}</p>}
        <span aria-hidden="true" className="mt-3 inline-block rounded-full bg-primary px-4 py-1 text-xs text-white group-hover:bg-primary-dark">
          Read more
        </span>
      </div>
    </article>
  );
}
