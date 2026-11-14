"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getImageProps, type ImageLoader } from "next/image";
import Link from "next/link";

export type CarouselSlide = {
  key: string;
  src: string;
  /** 5:3 image for phones (< 768px). */
  mobileSrc: string;
  alt: string;
  href: string | null;
  blurDataURL?: string | null;
};

const INTERVAL_MS = 5000;

/**
 * Resize a Sanity CDN URL that already has w/h/crop params, keeping its aspect ratio, so the
 * browser can pick a width from the srcset instead of always downloading the 2000px image.
 */
const sanityLoader: ImageLoader = ({ src, width }) => {
  const url = new URL(src);
  const w = Number(url.searchParams.get("w"));
  const h = Number(url.searchParams.get("h"));
  url.searchParams.set("w", String(width));
  if (w && h) url.searchParams.set("h", String(Math.round((width * h) / w)));
  return url.toString();
};

/**
 * Hero banner: CSS scroll-snap track with auto-advance. Rotation pauses on hover/focus, never
 * starts for reduced motion, and can be stopped with the pause button (WCAG 2.2.2).
 */
export function HeroCarousel({ slides, desktopAspect = 2.5 }: { slides: CarouselSlide[]; /** width / height from 768px up */ desktopAspect?: number }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  // Explicit pause by the user; unlike hover/focus it stays until they press play.
  const [stopped, setStopped] = useState(false);
  const rotating = !paused && !stopped;

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
  }, []);

  // Keep the active dot in sync with swipes / scrolls.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => setCurrent(Math.round(track.scrollLeft / track.clientWidth));
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!rotating || slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => goTo((current + 1) % slides.length), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [current, rotating, goTo, slides.length]);

  if (!slides.length) return null;

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured products"
      className="relative bg-surface"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget as Node | null) && setPaused(false)}
    >
      <div
        ref={trackRef}
        // Announce slide changes only when the user is in control (not every 5 seconds).
        aria-live={rotating ? "off" : "polite"}
        style={{ "--hero-aspect": String(desktopAspect) } as React.CSSProperties}
        className="flex aspect-[5/3] snap-x md:aspect-(--hero-aspect) snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, index) => {
          // Art direction: phones download only the 5:3 image, larger screens only the 5:2 one.
          const shared = {
            alt: slide.alt,
            fill: true,
            sizes: "100vw",
            // No `preload` here: with <picture> it would fetch both images. Eager + high priority instead.
            loading: index === 0 ? ("eager" as const) : ("lazy" as const),
            fetchPriority: index === 0 ? ("high" as const) : undefined,
            loader: sanityLoader,
          };
          const { props: desktop } = getImageProps({ ...shared, src: slide.src });
          const { props: mobile } = getImageProps({ ...shared, src: slide.mobileSrc });
          const image = (
            <picture>
              <source media="(max-width: 767px)" srcSet={mobile.srcSet ?? mobile.src} />
              <img
                {...desktop}
                alt={slide.alt}
                className="object-cover"
                style={{
                  ...desktop.style,
                  ...(slide.blurDataURL && { backgroundImage: `url(${slide.blurDataURL})`, backgroundSize: "cover" }),
                }}
              />
            </picture>
          );
          const common = {
            "aria-roledescription": "slide",
            "aria-label": `${index + 1} of ${slides.length}: ${slide.alt}`,
            className: "relative h-full w-full shrink-0 snap-start focus-visible:-outline-offset-4",
          };
          return slide.href ? (
            <Link key={slide.key} href={slide.href} {...common}>
              {image}
            </Link>
          ) : (
            <div key={slide.key} role="group" {...common}>
              {image}
            </div>
          );
        })}
      </div>

      {slides.length > 1 && (
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-1">
        <button
          type="button"
          onClick={() => setStopped((s) => !s)}
          aria-label={stopped ? "Play slideshow" : "Pause slideshow"}
          className="mr-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white transition-colors hover:bg-black/60"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3.5 fill-current">
            {stopped ? <path d="M8 5v14l11-7z" /> : <path d="M7 5h4v14H7zM13 5h4v14h-4z" />}
          </svg>
        </button>
        {slides.map((slide, index) => (
          <button
            key={slide.key}
            type="button"
            onClick={() => goTo(index)}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={current === index ? "true" : undefined}
            className="flex h-6 w-6 items-center justify-center"
          >
            <span
              className={`h-2 w-2 rounded-full transition-colors ${current === index ? "bg-primary" : "bg-white/60"}`}
            />
          </button>
        ))}
      </div>
      )}
    </section>
  );
}
