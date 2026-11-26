import { CATEGORIES, POPULAR, PRESETS as UPRESETS, STYLES } from "./transforms";
import { PRESETS as DPRESETS } from "./design-presets";
import { PLATFORMS } from "./social";
import { TOOLS } from "./text-tools";
import { TOOL_LINKS } from "./nav";

export type Entry = { id: string; title: string; cat: string; hint: string; href: string; kw: string };
export const CAT_ORDER = ["Tools", "Social templates", "Text styles", "Symbols", "Text Art", "Presets"];
const cn = (id: string) => CATEGORIES.find(([i]) => i === id)?.[1] ?? id;

export function buildIndex(): Entry[] {
  const e: Entry[] = [];
  TOOL_LINKS.forEach((l) => e.push({ id: l.href, title: l.title, cat: "Tools", hint: l.desc, href: l.href, kw: l.desc }));
  TOOLS.forEach((t) => e.push({ id: "tool-" + t.id, title: t.name, cat: "Tools", hint: `Text Tools · ${t.group}`, href: `/text-tools#${t.id}`, kw: `${t.desc} ${t.kw}` }));
  PLATFORMS.forEach((p) => { e.push({ id: "plat-" + p.id, title: p.name, cat: "Social templates", hint: p.limitLabel, href: `/social-creator#${p.id}`, kw: `${p.group} ${p.tpls.map((t) => t.name).join(" ")} bio caption post` }); p.tpls.forEach((t) => e.push({ id: `tpl-${p.id}-${t.id}`, title: `${p.name}: ${t.name}`, cat: "Social templates", hint: p.limitLabel, href: `/social-creator#${p.id}`, kw: p.group })); });
  STYLES.forEach((s) => e.push({ id: "style-" + s.id, title: s.name, cat: s.cat === "symbols" ? "Symbols" : s.cat === "art" ? "Text Art" : "Text styles", hint: s.cat === "symbols" || s.cat === "art" ? "Library" : cn(s.cat), href: `/#cat-${s.cat}`, kw: `${cn(s.cat)} ${POPULAR.includes(s.id) ? "popular" : ""}` }));
  UPRESETS.forEach((p) => e.push({ id: "up-" + p.label, title: p.label, cat: "Presets", hint: "Style preset", href: "/#pre-h", kw: `${cn(p.cat)} preset` }));
  DPRESETS.forEach((p) => e.push({ id: "dp-" + p.id, title: `${p.name} design`, cat: "Presets", hint: "Design Studio preset", href: "/design-studio", kw: "design studio poster graphic preset template" }));
  return e;
}
export function search(index: Entry[], q: string, perGroup = 6): Entry[] {
  const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return index.filter((x) => x.cat === "Tools" && x.href.indexOf("#") < 0);
  const scored = index.map((x) => { const t = x.title.toLowerCase(), hay = `${t} ${x.kw.toLowerCase()} ${x.cat.toLowerCase()}`; let s = 0; for (const w of terms) { if (!hay.includes(w)) return { x, s: -1 }; s += t.startsWith(w) ? 10 : t.split(/[\s:()-]+/).some((p) => p.startsWith(w)) ? 6 : t.includes(w) ? 4 : 1; } return { x, s }; }).filter((r) => r.s > 0);
  return CAT_ORDER.flatMap((c) => scored.filter((r) => r.x.cat === c).sort((a, b) => b.s - a.s).slice(0, perGroup).map((r) => r.x));
}
