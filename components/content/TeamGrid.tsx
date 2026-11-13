import { SanityImage } from "@/components/SanityImage";
import type { TeamMember } from "@/lib/types";

/** Team members as large round photos with a navy ring (as the live site), bio behind "Read more". */
export function TeamGrid({ heading, members }: { heading?: string | null; members?: TeamMember[] | null }) {
  const people = members?.filter(Boolean) ?? [];
  if (!people.length) return null;

  return (
    <section id="team" aria-labelledby={heading ? "team-heading" : undefined} className="mt-16 scroll-mt-28">
      {heading && (
        <h2 id="team-heading" className="mb-10 text-center text-[22px] font-bold uppercase text-primary">
          {heading}
        </h2>
      )}
      <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((person) => (
          <li key={person._id} className="text-center">
            {person.photo?.asset && (
              <SanityImage
                image={person.photo}
                alt={person.photo.alt ?? person.name}
                width={210}
                sizes="210px"
                className="mx-auto mb-5 size-[210px] rounded-full border-4 border-primary object-cover p-[3px]"
              />
            )}
            <h3 className="text-base font-semibold uppercase text-primary">{person.name}</h3>
            {person.role && <p className="mt-1 text-sm font-light text-[#3a3a3a]">{person.role}</p>}
            {person.email && (
              <a href={`mailto:${person.email}`} className="mt-1 inline-block text-sm text-primary hover:underline">
                {person.email}
              </a>
            )}
            {person.bio && (
              <details className="group mx-auto mt-3 max-w-sm text-left">
                <summary className="cursor-pointer list-none text-center text-sm font-semibold text-primary hover:underline [&::-webkit-details-marker]:hidden">
                  <span className="group-open:hidden">Read more</span>
                  <span className="hidden group-open:inline">Show less</span>
                </summary>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-[#3a3a3a]">
                  {person.bio.split(/\n\s*\n/).map((para, i) => (
                    <p key={i}>{para.trim()}</p>
                  ))}
                </div>
              </details>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
