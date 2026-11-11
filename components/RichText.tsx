import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";
import Link from "next/link";
import { SanityImage } from "./SanityImage";
import type { SanityImage as SanityImageType } from "@/lib/types";
import { dataset, projectId } from "@/sanity/env";

type VideoBlock = { url?: string; caption?: string; file?: { asset?: { _ref: string } } };
type TableBlock = { rows?: { _key: string; cells?: string[] }[] };

/** "file-<id>-<ext>" -> CDN URL */
function fileUrl(ref: string) {
  const [, id, ext] = ref.split("-");
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${ext}`;
}

function embedUrl(url: string) {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="mt-10 mb-4 text-2xl font-semibold text-primary">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 mb-3 text-xl font-semibold text-primary">{children}</h3>,
    h4: ({ children }) => <h4 className="mt-6 mb-2 text-lg font-semibold">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-primary pl-4 italic">{children}</blockquote>
    ),
    normal: ({ children }) => <p className="my-4 leading-relaxed whitespace-pre-line">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="my-4 list-disc space-y-2 pl-6">{children}</ul>,
    number: ({ children }) => <ol className="my-4 list-decimal space-y-2 pl-6">{children}</ol>,
  },
  marks: {
    link: ({ value, children }) => {
      const href: string = value?.href ?? "#";
      const external = /^https?:\/\//.test(href) || value?.blank;
      if (href.startsWith("/")) {
        return (
          <Link href={href} className="text-primary underline underline-offset-2 hover:no-underline">
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          className="text-primary underline underline-offset-2 hover:no-underline"
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }: { value: SanityImageType & { caption?: string } }) => (
      <figure className="my-8">
        <SanityImage image={value} width={960} className="h-auto w-full rounded-lg" sizes="(min-width: 1024px) 960px, 100vw" />
        {value.caption && <figcaption className="mt-2 text-center text-sm text-gray-500">{value.caption}</figcaption>}
      </figure>
    ),
    video: ({ value }: { value: VideoBlock }) => {
      const src = value.file?.asset?._ref ? fileUrl(value.file.asset._ref) : value.url;
      if (!src) return null;
      const embed = embedUrl(src);
      return (
        <figure className="my-8">
          {embed ? (
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <iframe
                src={embed}
                title={value.caption ?? "Video"}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          ) : (
            <video src={src} controls playsInline preload="metadata" className="w-full rounded-lg" />
          )}
          {value.caption && <figcaption className="mt-2 text-center text-sm text-gray-500">{value.caption}</figcaption>}
        </figure>
      );
    },
    table: ({ value }: { value: TableBlock }) => {
      const [head, ...rows] = value.rows ?? [];
      if (!head) return null;
      return (
        <div className="my-8 overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-primary text-white">
              <tr>
                {head.cells?.map((cell, i) => (
                  <th key={i} scope="col" className="px-4 py-3 text-left font-semibold">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((row) => (
                <tr key={row._key} className="even:bg-surface">
                  {row.cells?.map((cell, i) => (
                    <td key={i} className="px-4 py-3 align-top">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
  },
};

export function RichText({ value, className }: { value: PortableTextBlock[] | null | undefined; className?: string }) {
  if (!value?.length) return null;
  return (
    <div className={className}>
      <PortableText value={value} components={components} />
    </div>
  );
}
