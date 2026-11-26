import { applyStyle, styleById } from "./style-utils";
export type BOpts = { styles: string[]; prefix: string; suffix: string; numbering: "none" | "dot" | "paren" | "hash"; start: number; sort: "none" | "asc" | "desc"; dedupe: boolean; ic: boolean; skipEmpty: boolean; trim: boolean; headings: boolean };
export type Block = { id: string; name: string; lines: string[] };
export const BATCH_DEFAULTS: BOpts = { styles: ["bold"], prefix: "", suffix: "", numbering: "none", start: 1, sort: "none", dedupe: false, ic: true, skipEmpty: true, trim: true, headings: true };

/** Clean, dedupe and sort the raw lines (before any styling). */
export function prepLines(text: string, o: BOpts): string[] {
  let ls = text.split(/\r?\n/);
  if (o.trim) ls = ls.map((l) => l.trim());
  if (o.skipEmpty) ls = ls.filter((l) => l.trim());
  if (o.dedupe) { const seen = new Set<string>(); ls = ls.filter((l) => { const k = o.ic ? l.toLowerCase() : l; if (seen.has(k)) return false; seen.add(k); return true; }); }
  if (o.sort !== "none") { const c = new Intl.Collator(undefined, { numeric: true, sensitivity: o.ic ? "base" : "variant" }); ls = [...ls].sort((a, b) => c.compare(a, b)); if (o.sort === "desc") ls.reverse(); }
  return ls;
}
const num = (o: BOpts, i: number) => (o.numbering === "none" ? "" : o.numbering === "dot" ? `${o.start + i}. ` : o.numbering === "paren" ? `${o.start + i}) ` : `#${o.start + i} `);
export function processBatch(text: string, o: BOpts): { base: string[]; blocks: Block[] } {
  const base = prepLines(text, o), ids = o.styles.filter((id) => styleById(id));
  const blocks = (ids.length ? ids : ["plain"]).map((id) => { const s = styleById(id); return { id, name: s?.name ?? "Plain", lines: base.map((l, i) => `${num(o, i)}${o.prefix}${l && applyStyle(s, l)}${o.suffix}`) }; });
  return { base, blocks };
}
export const blocksToText = (b: Block[], headings: boolean) => b.map((x) => (headings && b.length > 1 ? `— ${x.name} —\n` : "") + x.lines.join("\n")).join("\n\n");
