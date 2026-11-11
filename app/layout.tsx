import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: "UK manufacturer and supplier of radiator caps, filler necks and cooling system parts.",
  icons: { icon: "/img/favicon.png" },
};

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
