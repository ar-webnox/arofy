import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/content";
import { StudioLoader } from "@/components/design-studio/loader";
import { StudioFaq } from "@/components/design-studio/studio-faq";
import { SITE } from "@/lib/site";

const title = "Text Design Studio | AROFY";
const description = "Design text visually: layers, 19 fonts, gradients, neon glow, 3D shadows, outlines and image backgrounds. Export PNG, transparent PNG or SVG. Free, in your browser.";
export const metadata: Metadata = { title, description, alternates: { canonical: "/design-studio" }, openGraph: { type: "website", siteName: SITE.name, url: "/design-studio", title, description }, twitter: { card: "summary_large_image", title, description } };

const faq = [
  ["Is my artwork uploaded anywhere?", "No. Layers, background images and exports are all processed in your browser, so nothing is sent to a server."],
  ["What is the difference between PNG and SVG export?", "PNG is a pixel image that always shows your exact fonts and effects, up to 8192 px on the longest side. SVG keeps text editable, but fonts are referenced by name and are not embedded."],
  ["Can I undo a preset or a reset?", "Yes. Presets, resets and every edit are part of the undo history (Ctrl/⌘+Z)."],
] as const;
const ld = { "@context": "https://schema.org", "@type": "WebApplication", name: "AROFY Text Design Studio", url: `${SITE.url}/design-studio`, description, applicationCategory: "DesignApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } };

export default function DesignStudioPage() {
  return (
    <>
      <Header />
      <main id="top">
        <div className="mx-auto max-w-[1500px] px-4 pb-16 pt-8 sm:px-6">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">Text design studio</h1>
          <p className="mb-6 mt-2 max-w-2xl text-muted">Layer, style and export text graphics. Drag to move, use the corner handle to resize and the top handle to rotate.</p>
          <StudioLoader />
        </div>
        <article className="mx-auto max-w-3xl px-4 pb-8 sm:px-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight">What you can design</h2>
          <p className="mt-3 leading-relaxed text-muted">Build posters, thumbnails, quote cards and social graphics from multiple text layers. Each layer has its own font, gradient or solid fill, shadow, neon or soft glow, outline, 3D depth and highlight. Set the canvas to a social-media size, add a gradient or your own background image, then export a crisp PNG at up to 4× resolution, a transparent PNG for overlays or an SVG with live text.</p>
        </article>
        <StudioFaq items={faq} />
      </main>
      <Footer />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
    </>
  );
}
