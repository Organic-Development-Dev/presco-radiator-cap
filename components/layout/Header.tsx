import Image from "next/image";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import { CATEGORIES_QUERY } from "@/sanity/lib/queries";
import { getSiteSettings } from "@/lib/settings";
import { SITE_NAME } from "@/lib/site";
import type { Category } from "@/lib/types";
import { DesktopNav } from "./DesktopNav";
import { MobileMenu } from "./MobileMenu";
import { SearchDialog } from "./SearchDialog";
import { buildNavItems } from "./nav-data";

async function getCategories(): Promise<Category[]> {
  try {
    return (await sanityFetch<Category[]>({ query: CATEGORIES_QUERY, tags: ["productCategory"] })) ?? [];
  } catch (error) {
    // Keep the site chrome rendering; the products menu just shows "View all products".
    console.error("Header: failed to load product categories", error);
    return [];
  }
}

export async function Header() {
  const [settings, categories] = await Promise.all([getSiteSettings(), getCategories()]);
  const items = buildNavItems(settings?.mainMenu, categories);
  const siteName = settings?.siteName || SITE_NAME;

  return (
    <header className="sticky top-0 z-30 bg-white shadow-[0_4px_12px_0_rgba(0,0,0,0.05)]">
      <div className="container-site flex items-center justify-between gap-4 py-4">
        <Link href="/" className="shrink-0" aria-label={`${siteName} – home`}>
          <Image src="/img/logo.png" alt={siteName} width={300} height={124} preload className="h-auto w-36 sm:w-43" />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-6 lg:flex xl:gap-10">
          <DesktopNav items={items} />
          <SearchDialog variant="desktop" />
        </nav>

        <div className="flex items-center gap-4 lg:hidden">
          <SearchDialog variant="mobile" />
          <MobileMenu items={items} />
        </div>
      </div>
    </header>
  );
}
