import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { getSiteSettings } from "@/lib/settings";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-montserrat",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings?.siteName || SITE_NAME;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: siteName, template: `%s | ${siteName}` },
    description: settings?.defaultSeo?.description ?? undefined,
    applicationName: siteName,
    icons: { icon: "/img/favicon.png" },
    formatDetection: { telephone: false, email: false, address: false },
    robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  };
}

export const viewport: Viewport = {
  themeColor: "#a11a36",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}
