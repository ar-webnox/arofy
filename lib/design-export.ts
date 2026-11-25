import { FONTS, loadFonts, measure, outSize, renderDoc, type Doc, type Fill } from "./design";
export function download(href: string, name: string) { const a = document.createElement("a"); a.href = href; a.download = name; document.body.append(a); a.click(); a.remove(); }

export async function exportPng(d: Doc, img: HTMLImageElement | null, scale: number, transparent: boolean): Promise<Blob> {
  await loadFonts(d.layers); await document.fonts.ready;
  const { k, w, h } = outSize(d, scale), c = document.createElement("canvas"); c.width = w; c.height = h;
  const x = c.getContext("2d")!; x.imageSmoothingQuality = "high"; renderDoc(x, d, img, k, transparent);
  return new Promise((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error("PNG encoding failed"))), "image/png"));
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const f2 = (n: number) => +n.toFixed(2);
function gradDef(id: string, f: { type: string; stops: string[]; angle: number }) {
  const st = f.stops.map((s, i) => `<stop offset="${f2(i / (f.stops.length - 1))}" stop-color="${s.slice(0, 7)}"${s.length > 7 ? ` stop-opacity="${f2(parseInt(s.slice(7, 9), 16) / 255)}"` : ""}/>`).join("");
  if (f.type === "radial") return `<radialGradient id="${id}">${st}</radialGradient>`;
  const a = ((f.angle - 90) * Math.PI) / 180;
  return `<linearGradient id="${id}" x1="${f2(0.5 - Math.cos(a) / 2)}" y1="${f2(0.5 - Math.sin(a) / 2)}" x2="${f2(0.5 + Math.cos(a) / 2)}" y2="${f2(0.5 + Math.sin(a) / 2)}">${st}</linearGradient>`;
}
const paintAttr = (id: string, f: Fill) => (f.type === "none" ? "none" : f.type === "solid" ? f.stops[0] : `url(#${id})`);

/** Live-text SVG. Fonts are referenced by name, not embedded, so they must be installed where the SVG is opened. */
export function toSvg(d: Doc, img: HTMLImageElement | null, imgSrc: string, transparent: boolean): string {
  const defs: string[] = [], body: string[] = [], b = d.bg;
  if (!transparent && b.type !== "transparent") {
    if (b.type === "image") {
      body.push(`<rect width="${d.w}" height="${d.h}" fill="${b.c1}"/>`);
      if (img && imgSrc) { const k = (b.fit === "cover" ? Math.max : Math.min)(d.w / img.width, d.h / img.height) * b.scale; body.push(`<image href="${imgSrc}" x="${f2(d.w / 2 - (img.width * k) / 2 + b.ox)}" y="${f2(d.h / 2 - (img.height * k) / 2 + b.oy)}" width="${f2(img.width * k)}" height="${f2(img.height * k)}" preserveAspectRatio="none"/>`); }
    } else if (b.type === "solid") body.push(`<rect width="${d.w}" height="${d.h}" fill="${b.c1}"/>`);
    else { defs.push(gradDef("bg", { type: b.type, stops: [b.c1, b.c2], angle: b.angle })); body.push(`<rect width="${d.w}" height="${d.h}" fill="url(#bg)"/>`); }
  }
  d.layers.forEach((l, n) => {
    const m = measure(l), ax = l.align === "left" ? -m.w / 2 : l.align === "right" ? m.w / 2 : 0, y0 = -m.h / 2 + m.lh / 2, fam = FONTS.find((f) => f.id === l.font)?.svg ?? "sans-serif";
    const anchor = { left: "start", center: "middle", right: "end" }[l.align];
    const T = (extra: string) => `<text font-family="${fam}" font-size="${l.size}" font-weight="${l.weight}" font-style="${l.italic ? "italic" : "normal"}" letter-spacing="${l.ls}" text-anchor="${anchor}" dominant-baseline="central" xml:space="preserve" ${extra}>${m.lines.map((t, i) => `<tspan x="${f2(ax)}" y="${f2(y0 + i * m.lh)}">${esc(t) || " "}</tspan>`).join("")}</text>`;
    const g: string[] = [];
    if (l.hl.on) m.lines.forEach((_, i) => { const w = m.widths[i], x0 = l.align === "left" ? ax : l.align === "right" ? ax - w : ax - w / 2; g.push(`<rect x="${f2(x0 - l.hl.pad)}" y="${f2(y0 + i * m.lh - m.lh / 2)}" width="${f2(w + l.hl.pad * 2)}" height="${f2(m.lh)}" fill="${l.hl.color}"/>`); });
    if (l.extrude.on) for (let k = l.extrude.depth; k >= 1; k--) g.push(T(`fill="${l.extrude.color}" transform="translate(${k} ${k})"`));
    const fx: string[] = [];
    if (l.fill.type !== "none") { if (l.glow.on) fx.push(`<feDropShadow dx="0" dy="0" stdDeviation="${f2(l.glow.blur / 2)}" flood-color="${l.glow.color}"/>`.repeat(2)); if (l.shadow.on) fx.push(`<feDropShadow dx="${l.shadow.x}" dy="${l.shadow.y}" stdDeviation="${f2(l.shadow.blur / 2)}" flood-color="${l.shadow.color}"/>`); }
    if (l.fill.type === "linear" || l.fill.type === "radial") defs.push(gradDef(`g${n}`, l.fill));
    if (fx.length) defs.push(`<filter id="f${n}" x="-50%" y="-50%" width="200%" height="200%">${fx.join("")}</filter>`);
    const st = l.stroke.on ? ` stroke="${l.stroke.color}" stroke-width="${l.stroke.w}" stroke-linejoin="round"` : "";
    g.push(T(`fill="${paintAttr(`g${n}`, l.fill)}"${st}${l.deco !== "none" ? ` text-decoration="${l.deco}"` : ""}${fx.length ? ` filter="url(#f${n})"` : ""}`));
    body.push(`<g transform="translate(${f2(l.x)} ${f2(l.y)}) rotate(${f2(l.rot)})" opacity="${l.opacity}">${g.join("")}</g>`);
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${d.w}" height="${d.h}" viewBox="0 0 ${d.w} ${d.h}"><defs>${defs.join("")}</defs>${body.join("")}</svg>`;
}
