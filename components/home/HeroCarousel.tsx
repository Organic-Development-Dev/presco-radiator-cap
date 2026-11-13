"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export type CarouselSlide = {
  key: string;
  src: string;
  alt: string;
  href: string | null;
  blurDataURL?: string | null;
};

const INTERVAL_MS = 5000;

/** Hero banner: CSS scroll-snap track with auto-advance (paused on hover/focus and for reduced motion). */
export function HeroCarousel({ slides }: { slides: CarouselSlide[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

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
    if (paused || slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => goTo((current + 1) % slides.length), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [current, paused, goTo, slides.length]);

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
        className="flex aspect-[5/3] snap-x md:aspect-[5/2] snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((slide, index) => {
          const image = (
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              preload={index === 0}
              sizes="100vw"
              placeholder={slide.blurDataURL ? "blur" : "empty"}
              blurDataURL={slide.blurDataURL ?? undefined}
              // Sanity's CDN already sizes and converts the image.
              unoptimized
              className="object-cover"
            />
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
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1">
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
