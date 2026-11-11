import Image from "next/image";

const TESTIMONIALS = [
  {
    quote:
      "We are proud to be a partner with Presco as our radiator Cap supplier in the UK. Their commitment to excellence and reliability has been instrumental in meeting our radiator Cap needs efficiently. With their high-quality products and exceptional service, Presco has consistently exceeded our expectations, ensuring our facilities remain comfortable and energy-efficient. We highly recommend Presco to any organization seeking top-notch radiator-cap solutions and outstanding customer support",
    name: "Subair .U",
    role: "Chairman & MD",
    company: "CoolLine Group – U.A.E",
  },
];

export function Testimonials() {
  return (
    <section aria-labelledby="testimonials-heading" className="container-site py-10">
      <h2 id="testimonials-heading" className="text-center text-lg uppercase text-primary">
        <span className="block font-light">Testimonials</span>
        <span className="block font-bold">What our clients say</span>
      </h2>
      <div className="space-y-8 py-10">
        {TESTIMONIALS.map((t) => (
          <figure
            key={t.name}
            className="mx-auto max-w-2xl rounded-3xl p-4 pb-8 text-center shadow-[0_4px_4px_0_rgba(0,0,0,0.25)]"
          >
            <Image src="/img/feed-back.png" alt="" width={28} height={23} className="mx-auto mt-4 h-auto w-5" />
            <blockquote className="pt-4 text-xs leading-relaxed font-light text-[#3a3a3a]">
              <p>{t.quote}</p>
            </blockquote>
            <figcaption className="pt-6 text-xs text-[#3a3a3a]">
              <span className="block font-semibold uppercase text-secondary">{t.name}</span>
              <span className="block pt-2">{t.role}</span>
              <span className="block pt-2">{t.company}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
