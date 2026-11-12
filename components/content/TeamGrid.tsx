import { SanityImage } from "@/components/SanityImage";
import type { TeamMember } from "@/lib/types";

export function TeamGrid({ heading, members }: { heading?: string | null; members?: TeamMember[] | null }) {
  const people = members?.filter(Boolean) ?? [];
  if (!people.length) return null;

  return (
    <section id="team" aria-labelledby={heading ? "team-heading" : undefined} className="mt-16 scroll-mt-28">
      {heading && (
        <h2 id="team-heading" className="mb-8 text-2xl font-semibold text-primary">
          {heading}
        </h2>
      )}
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {people.map((person) => (
          <li key={person._id} className="flex flex-col rounded-lg border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-4">
              {person.photo?.asset && (
                <SanityImage
                  image={person.photo}
                  alt={person.photo.alt ?? person.name}
                  width={96}
                  className="size-24 shrink-0 rounded-full object-cover"
                  sizes="96px"
                />
              )}
              <div className="min-w-0">
                <h3 className="text-lg font-semibold text-secondary">{person.name}</h3>
                {person.role && <p className="text-sm text-gray-600">{person.role}</p>}
                {person.email && (
                  <a href={`mailto:${person.email}`} className="block truncate text-sm text-primary hover:underline">
                    {person.email}
                  </a>
                )}
              </div>
            </div>
            {person.bio && (
              <div className="mt-4 space-y-3 text-sm leading-relaxed text-gray-700">
                {person.bio.split(/\n\s*\n/).map((para, i) => (
                  <p key={i}>{para.trim()}</p>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
