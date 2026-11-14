import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";
import Link from "next/link";
import { SanityImage } from "./SanityImage";
import type { SanityImage as SanityImageType } from "@/lib/types";
import { croppedSize, withDimensions } from "@/lib/image";
import { dataset, projectId } from "@/sanity/env";

type VideoBlock = { url?: string; caption?: string; file?: { asset?: { _ref: string } } };
type TableBlock = { imageColumn?: number; rows?: { _key: string; cells?: string[]; image?: SanityImageType }[] };

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

type VideoGroup = { _type: "videoGroup"; _key: string; videos: (VideoBlock & { _key: string })[] };

/**
 * Uploaded clips are often portrait phone videos: at full width a 9:16 clip is
 * three screens tall. Cap the height and centre them; embeds stay 16:9.
 */
function VideoFigure({
  value,
  className,
  videoClassName = "mx-auto max-h-[70vh]",
}: {
  value: VideoBlock;
  className?: string;
  /** Sizing for uploaded clips; grouped clips share a fixed height so they line up. */
  videoClassName?: string;
}) {
  const src = value.file?.asset?._ref ? fileUrl(value.file.asset._ref) : value.url;
  if (!src) return null;
  const embed = embedUrl(src);
  return (
    <figure className={className}>
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
        <video
          src={src}
          controls
          playsInline
          preload="metadata"
          className={`block w-auto max-w-full rounded-lg bg-black shadow-sm ${videoClassName}`}
        />
      )}
      {value.caption && <figcaption className="mt-2 text-center text-sm text-gray-500">{value.caption}</figcaption>}
    </figure>
  );
}

/** Merge runs of 2+ consecutive video blocks into one videoGroup block. */
function groupVideos(blocks: PortableTextBlock[]): PortableTextBlock[] {
  const out: PortableTextBlock[] = [];
  for (let i = 0; i < blocks.length; ) {
    let j = i;
    while (j < blocks.length && blocks[j]._type === "video") j++;
    if (j - i >= 2) {
      const videos = blocks.slice(i, j) as unknown as VideoGroup["videos"];
      out.push({ _type: "videoGroup", _key: `${videos[0]._key}-group`, videos } as unknown as PortableTextBlock);
      i = j;
    } else {
      out.push(blocks[i]);
      i++;
    }
  }
  return out;
}

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => <h2 className="mt-10 mb-4 max-w-3xl text-2xl font-semibold text-accent">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 mb-3 max-w-3xl text-xl font-semibold text-accent">{children}</h3>,
    h4: ({ children }) => <h4 className="mt-6 mb-2 max-w-3xl text-lg font-semibold">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="my-6 max-w-3xl border-l-4 border-accent pl-4 italic">{children}</blockquote>
    ),
    normal: ({ children }) => <p className="my-4 max-w-3xl leading-relaxed whitespace-pre-line">{children}</p>,
  },
  list: {
    bullet: ({ children }) => <ul className="my-4 max-w-3xl list-disc space-y-2 pl-6">{children}</ul>,
    number: ({ children }) => <ol className="my-4 max-w-3xl list-decimal space-y-2 pl-6">{children}</ol>,
  },
  marks: {
    link: ({ value, children }) => {
      // An uploaded file wins over the URL; files open in a new tab.
      const fileRef: string | undefined = value?.file?.asset?._ref;
      if (fileRef) {
        return (
          <a href={fileUrl(fileRef)} target="_blank" rel="noopener" className="text-accent underline underline-offset-2 hover:no-underline">
            {children}
          </a>
        );
      }
      const href: string = value?.href ?? "#";
      const external = /^https?:\/\//.test(href) || value?.blank;
      if (href.startsWith("/")) {
        return (
          <Link href={href} className="text-accent underline underline-offset-2 hover:no-underline">
            {children}
          </Link>
        );
      }
      return (
        <a
          href={href}
          className="text-accent underline underline-offset-2 hover:no-underline"
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
      const size = croppedSize(value);
      const width = Math.min(size?.width ?? 960, 960);
      const image = withDimensions(value);
      return (
        <figure className="my-8" style={{ maxWidth: width }}>
          <SanityImage image={image} width={width} className="h-auto w-full rounded-lg" sizes={`(min-width: ${width}px) ${width}px, 100vw`} />
          {value.caption && <figcaption className="mt-2 text-center text-sm text-gray-500">{value.caption}</figcaption>}
        </figure>
      );
    },
    video: ({ value }: { value: VideoBlock }) => <VideoFigure value={value} className="my-8" />,
    // Consecutive videos, grouped by groupVideos() so they sit side by side.
    videoGroup: ({ value }: { value: VideoGroup }) => (
      <div className="my-8 flex flex-wrap items-start gap-6">
        {value.videos.map((video) => (
          <VideoFigure key={video._key} value={video} videoClassName="h-[min(60vh,32rem)]" />
        ))}
      </div>
    ),
    table: ({ value }: { value: TableBlock }) => {
      const [head, ...rows] = value.rows ?? [];
      if (!head) return null;
      return (
        <div className="my-8 overflow-x-auto">
          <table className="min-w-full border-collapse border border-accent text-[13px] text-accent">
            <thead>
              <tr>
                {head.cells?.map((cell, i) => (
                  <th key={i} scope="col" className="border border-accent px-4 py-3 text-left font-semibold tracking-[1.5px] uppercase">
                    {cell}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row._key}>
                  {row.cells?.map((cell, i) => (
                    <td key={i} className="border border-accent px-4 py-3 align-top">
                      {value.imageColumn === i + 1 && row.image?.asset && (
                        <SanityImage image={withDimensions(row.image)} width={160} className="h-auto w-28 max-w-none sm:w-40" sizes="160px" />
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
      <PortableText value={groupVideos(value)} components={components} />
    </div>
  );
}
