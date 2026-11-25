import type { Metadata, Viewport } from "next";
import { Inter, Fraunces } from "next/font/google";
import { SITE, FAQ } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const title = `${SITE.name} – Fancy Text Generator & Font Styler`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url), title, description: SITE.description, alternates: { canonical: "/" },
  openGraph: { type: "website", url: SITE.url, siteName: SITE.name, title, description: SITE.description },
  twitter: { card: "summary_large_image", title, description: SITE.description },
};
export const viewport: Viewport = { themeColor: [{ media: "(prefers-color-scheme: light)", color: "#faf9f7" }, { media: "(prefers-color-scheme: dark)", color: "#0f0f0e" }] };

const themeScript = `try{var t=localStorage.getItem('arofy-theme');if(t==='dark'||(t!=='light'&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;
const jsonLd = [
  { "@context": "https://schema.org", "@type": "WebApplication", name: SITE.name, url: SITE.url, description: SITE.description, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } },
  { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: FAQ.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${fraunces.variable}`}>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body>
        {children}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
