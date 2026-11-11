"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const SLIDES = [
  {
    src: "/img/banner1.webp",
    alt: "Presco Radiator Caps - Premium Automotive Components",
    href: "/products/",
  },
  {
    src: "/img/banner2.webp",
    alt: "High-Performance Radiator Caps for All Vehicle Types",
    href: "/product-category/auto/",
  },
  {
    src: "/img/banner3.webp",
    alt: "Quality Engineered Cooling System Components",
    href: "/products/",
  },
];

const INTERVAL_MS = 5000;

/** Hero banner: CSS scroll-snap track with auto-advance (paused on hover/focus and for reduced motion). */
export function HeroCarousel() {
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
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = setInterval(() => goTo((current + 1) % SLIDES.length), INTERVAL_MS);
    return () => clearInterval(timer);
  }, [current, paused, goTo]);

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
        className="flex aspect-[5/2] snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {SLIDES.map((slide, index) => (
          <Link
            key={slide.src}
            href={slide.href}
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${SLIDES.length}: ${slide.alt}`}
            className="relative h-full w-full shrink-0 snap-start focus-visible:-outline-offset-4"
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              preload={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          </Link>
        ))}
      </div>

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1">
        {SLIDES.map((slide, index) => (
          <button
            key={slide.src}
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
    </section>
  );
}
