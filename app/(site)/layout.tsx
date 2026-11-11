import { GoogleTagManager } from "@next/third-parties/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {GTM_ID && <GoogleTagManager gtmId={GTM_ID} />}
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:bg-white focus:p-3">
        Skip to content
      </a>
      <Header />
      <main id="main" className="min-h-[60vh]">
        {children}
      </main>
      <Footer />
    </>
  );
}
