import Image from "next/image";
import type { Testimonial } from "@/lib/types";

type Props = { heading?: string | null; subheading?: string | null; testimonials: Testimonial[] };

export function Testimonials({ heading, subheading, testimonials }: Props) {
  if (!testimonials.length) return null;
  return (
    <section aria-labelledby="testimonials-heading" className="container-site py-10">
      <h2 id="testimonials-heading" className="text-center text-lg uppercase text-accent">
        {heading && <span className="block font-light">{heading}</span>}
        {subheading && <span className="block font-bold">{subheading}</span>}
      </h2>
      <div className="space-y-8 py-10">
        {testimonials.map((t) => (
          <figure
            key={t._id}
            className="mx-auto max-w-2xl rounded-3xl p-4 pb-8 text-center shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]"
          >
            <Image src="/img/feed-back.png" alt="" width={28} height={23} className="mx-auto mt-4 h-auto w-5" />
            <blockquote className="pt-4 text-xs leading-relaxed font-light whitespace-pre-line text-body">
              <p>{t.quote}</p>
            </blockquote>
            <figcaption className="pt-6 text-xs text-body">
              <span className="block font-semibold uppercase text-ink">{t.name}</span>
              {t.role && <span className="block pt-2">{t.role}</span>}
              {t.company && <span className="block pt-2">{t.company}</span>}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
