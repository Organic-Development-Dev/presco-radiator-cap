import Image from "next/image";

/**
 * Stand-in for a missing photo: the Presco logo as a faint watermark on the band colour.
 * Fills its (relatively positioned) parent; decorative, so hidden from screen readers.
 */
export function BrandPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`absolute inset-0 flex items-center justify-center bg-band ${className}`}>
      <Image
        src="/img/logo.png"
        alt=""
        width={300}
        height={124}
        sizes="300px"
        className="h-auto w-3/5 max-w-60 opacity-25 dark:brightness-0 dark:invert"
      />
    </div>
  );
}
