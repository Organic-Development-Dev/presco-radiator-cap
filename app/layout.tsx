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
    icons: {
      icon: [
        { url: "/icons/icon.svg", type: "image/svg+xml" },
        { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: { url: "/icons/apple-touch-icon.png", sizes: "180x180" },
    },
    // iOS "Add to Home Screen": open full screen with the site name under the icon.
    appleWebApp: { capable: true, title: "Presco", statusBarStyle: "default" },
    formatDetection: { telephone: false, email: false, address: false },
    robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  };
}

export const viewport: Viewport = {
  // Browser UI colour follows the device's light/dark setting, matching the page.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#445a8e" },
    { media: "(prefers-color-scheme: dark)", color: "#121418" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={montserrat.variable}>
      <body>{children}</body>
    </html>
  );
}
