import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";
import Link from "next/link";
import { SanityImage } from "./SanityImage";
import type { SanityImage as SanityImageType } from "@/lib/types";
import { dataset, projectId } from "@/sanity/env";

type VideoBlock = { url?: string; caption?: string; file?: { asset?: { _ref: string } } };
type TableBlock = { imageColumn?: number; rows?: { _key: string; cells?: string[]; image?: SanityImageType }[] };

/** "image-<id>-500x400-png" -> { width: 500, height: 400 } */
function imageSize(ref?: string) {
  const m = ref?.match(/-(\d+)x(\d+)-[a-z]+$/);
  return m ? { width: Number(m[1]), height: Number(m[2]) } : null;
}

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
    image: ({ value }: { value: SanityImageType & { caption?: string } }) => {
      // Never stretch an image beyond its real size (small photos looked blown up at full width).
      const size = imageSize(value.asset?._ref);
      const width = Math.min(size?.width ?? 960, 960);
      const image = size ? { ...value, dimensions: { ...size, aspectRatio: size.width / size.height } } : value;
      return (
        <figure className="my-8" style={{ maxWidth: width }}>
          <SanityImage image={image} width={width} className="h-auto w-full rounded-lg" sizes={`(min-width: ${width}px) ${width}px, 100vw`} />
          {value.caption && <figcaption className="mt-2 text-center text-sm text-gray-500">{value.caption}</figcaption>}
        </figure>
      );
    },
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
        <div className="my-8 overflow-x-auto">
          <table className="min-w-full border-collapse border border-primary text-[13px] text-primary">
            <thead>
              <tr>
                {head.cells?.map((cell, i) => (
                  <th key={i} scope="col" className="border border-primary px-4 py-3 text-left font-semibold tracking-[1.5px] uppercase">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row._key}>
                  {row.cells?.map((cell, i) => (
                    <td key={i} className="border border-primary px-4 py-3 align-top">
                      {value.imageColumn === i + 1 && row.image?.asset && (
                        <SanityImage image={row.image} width={160} className="h-auto w-28 max-w-none sm:w-40" sizes="160px" />
                      )}
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
