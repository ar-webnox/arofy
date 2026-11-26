import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/content";
import { SITE } from "@/lib/site";

export const toolMeta = (title: string, description: string, path: string): Metadata => ({ title, description, alternates: { canonical: path }, openGraph: { type: "website", siteName: SITE.name, url: path, title, description }, twitter: { card: "summary_large_image", title, description } });

export function ToolShell({ title, intro, path, desc, about, faq, children }: { title: string; intro: string; path: string; desc: string; about: { h: string; p: string[] }; faq: readonly (readonly [string, string])[]; children: React.ReactNode }) {
  const ld = { "@context": "https://schema.org", "@type": "WebApplication", name: title, url: `${SITE.url}${path}`, description: desc, applicationCategory: "UtilitiesApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } };
  return (
    <>
      <Header />
      <main id="top">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-10 sm:px-6">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
          <p className="mb-8 mt-2 max-w-2xl text-muted">{intro}</p>
          {children}
        </div>
        <article className="mx-auto max-w-3xl px-4 pb-10 sm:px-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight">{about.h}</h2>
          {about.p.map((t) => <p key={t.slice(0, 24)} className="mt-3 leading-relaxed text-muted">{t}</p>)}
        </article>
        <section aria-labelledby="faq-h" className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
          <h2 id="faq-h" className="font-display text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
          <div className="mt-5 divide-y divide-line rounded-xl border border-line bg-surface">
            {faq.map(([q, a]) => <details key={q} className="group p-5"><summary className="flex cursor-pointer list-none items-center justify-between font-medium">{q}<span aria-hidden className="text-muted transition group-open:rotate-45">+</span></summary><p className="mt-3 text-muted">{a}</p></details>)}
          </div>
        </section>
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
