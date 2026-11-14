import Image from "next/image";

/**
 * Stand-in for a missing photo: the Presco logo as a faint watermark on a white tile
 * with a hairline border (so it doesn't vanish into the white page).
 * Fills its (relatively positioned) parent; decorative, so hidden from screen readers.
 * Only the logo zooms on a parent `group` hover, so the border isn't clipped.
 */
export function BrandPlaceholder({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`absolute inset-0 flex items-center justify-center rounded-[inherit] border border-gray-200 bg-page dark:bg-surface ${className}`}>
      <Image
        src="/img/logo.png"
        alt=""
        width={300}
        height={124}
        sizes="300px"
        className="h-auto w-3/5 max-w-60 opacity-25 transition-transform duration-300 group-hover:scale-105 dark:brightness-0 dark:invert"
      />
    </div>
  );
}
