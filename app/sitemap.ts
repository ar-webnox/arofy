import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap { return [{ url: SITE.url, changeFrequency: "monthly", priority: 1 }, { url: `${SITE.url}/design-studio`, changeFrequency: "monthly", priority: 0.9 }, ...["text-tools", "social-creator", "username-generator", "batch-styler"].map((p) => ({ url: `${SITE.url}/${p}`, changeFrequency: "monthly" as const, priority: 0.9 }))]; }
