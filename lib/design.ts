export type Fill = { type: "solid" | "linear" | "radial" | "none"; stops: string[]; angle: number };
export type Layer = {
  id: string; text: string; font: string; size: number; weight: number; italic: boolean; ls: number; lh: number;
  align: "left" | "center" | "right"; caps: "none" | "upper" | "lower"; opacity: number; x: number; y: number; rot: number;
  fill: Fill; shadow: { on: boolean; x: number; y: number; blur: number; color: string }; glow: { on: boolean; blur: number; color: string };
  extrude: { on: boolean; depth: number; color: string }; stroke: { on: boolean; w: number; color: string };
  hl: { on: boolean; color: string; pad: number }; deco: "none" | "underline" | "line-through";
};
export type Bg = { type: "solid" | "linear" | "radial" | "transparent" | "image"; c1: string; c2: string; angle: number; fit: "cover" | "contain"; scale: number; ox: number; oy: number };
export type Doc = { w: number; h: number; bg: Bg; layers: Layer[] };

export const FONTS = [
  { id: "inter", label: "Inter", css: "var(--font-inter)", svg: "Inter, sans-serif" },
  { id: "grotesk", label: "Space Grotesk", css: "var(--sf-grotesk)", svg: "'Space Grotesk', sans-serif" },
  { id: "oswald", label: "Oswald", css: "var(--sf-oswald)", svg: "Oswald, sans-serif" },
  { id: "bebas", label: "Bebas Neue", css: "var(--sf-bebas)", svg: "'Bebas Neue', sans-serif" },
  { id: "anton", label: "Anton", css: "var(--sf-anton)", svg: "Anton, Impact, sans-serif" },
  { id: "impact", label: "Impact", css: "Impact, 'Arial Black', sans-serif", svg: "Impact, 'Arial Black', sans-serif" },
  { id: "fraunces", label: "Fraunces", css: "var(--font-fraunces)", svg: "Fraunces, serif" },
  { id: "playfair", label: "Playfair Display", css: "var(--sf-playfair)", svg: "'Playfair Display', serif" },
  { id: "dmserif", label: "DM Serif Display", css: "var(--sf-dmserif)", svg: "'DM Serif Display', serif" },
  { id: "cinzel", label: "Cinzel", css: "var(--sf-cinzel)", svg: "Cinzel, serif" },
  { id: "abril", label: "Abril Fatface", css: "var(--sf-abril)", svg: "'Abril Fatface', serif" },
  { id: "georgia", label: "Georgia", css: "Georgia, serif", svg: "Georgia, serif" },
  { id: "orbitron", label: "Orbitron", css: "var(--sf-orbitron)", svg: "Orbitron, sans-serif" },
  { id: "press", label: "Press Start 2P", css: "var(--sf-press)", svg: "'Press Start 2P', monospace" },
  { id: "righteous", label: "Righteous", css: "var(--sf-righteous)", svg: "Righteous, sans-serif" },
  { id: "pacifico", label: "Pacifico", css: "var(--sf-pacifico)", svg: "Pacifico, cursive" },
  { id: "lobster", label: "Lobster", css: "var(--sf-lobster)", svg: "Lobster, cursive" },
  { id: "marker", label: "Permanent Marker", css: "var(--sf-marker)", svg: "'Permanent Marker', cursive" },
  { id: "courier", label: "Courier New", css: "'Courier New', monospace", svg: "'Courier New', monospace" },
];
export const SIZES: [string, number, number][] = [["Square 1:1", 1080, 1080], ["Portrait 4:5", 1080, 1350], ["Story 9:16", 1080, 1920], ["Landscape 16:9", 1920, 1080], ["Social share 1.91:1", 1200, 630], ["Pinterest 2:3", 1000, 1500], ["Banner 3:1", 1500, 500]];

const uid = () => Math.random().toString(36).slice(2, 9);
export const mkLayer = (o: Partial<Layer> = {}): Layer => ({
  id: uid(), text: "Your text", font: "inter", size: 120, weight: 700, italic: false, ls: 0, lh: 1.1, align: "center", caps: "none", opacity: 1, x: 540, y: 540, rot: 0,
  fill: { type: "solid", stops: ["#ffffff", "#ffffff"], angle: 90 }, shadow: { on: false, x: 6, y: 6, blur: 12, color: "#00000088" }, glow: { on: false, blur: 24, color: "#ff2bd6" },
  extrude: { on: false, depth: 12, color: "#111111" }, stroke: { on: false, w: 6, color: "#111111" }, hl: { on: false, color: "#111111", pad: 16 }, deco: "none", ...o,
});
export const solidBg = (c: string): Bg => ({ type: "solid", c1: c, c2: c, angle: 90, fit: "cover", scale: 1, ox: 0, oy: 0 });
export const defaultDoc = (): Doc => ({ w: 1080, h: 1080, bg: solidBg("#faf9f7"), layers: [mkLayer({ text: "Design your\ntext", font: "fraunces", size: 150, lh: 1.05, fill: { type: "solid", stops: ["#1a1916", "#1a1916"], angle: 90 } })] });

// ---------- family resolution (next/font css variables -> real family names for canvas)
const famCache = new Map<string, string>();
export function fam(id: string) {
  let v = famCache.get(id); if (v) return v;
  const f = FONTS.find((x) => x.id === id) ?? FONTS[0];
  if (!f.css.startsWith("var(")) v = f.css;
  else { const e = document.createElement("span"); e.style.fontFamily = f.css; (document.getElementById("studio-root") ?? document.body).append(e); v = getComputedStyle(e).fontFamily || f.svg; e.remove(); }
  famCache.set(id, v); return v;
}
export const fontSpec = (l: Layer, size = l.size) => `${l.italic ? "italic " : ""}${l.weight} ${size}px ${fam(l.font)}`;
export const loadFonts = (layers: Layer[]) => Promise.all([...new Set(layers.map((l) => fontSpec(l, 40)))].map((s) => document.fonts.load(s, "Aa")));

// ---------- measuring
let mc: CanvasRenderingContext2D | null = null;
const mctx = () => (mc ??= document.createElement("canvas").getContext("2d")!);
export const txt = (l: Layer) => (l.caps === "upper" ? l.text.toUpperCase() : l.caps === "lower" ? l.text.toLowerCase() : l.text);
export function measure(l: Layer, c: CanvasRenderingContext2D = mctx()) {
  c.font = fontSpec(l); (c as unknown as { letterSpacing: string }).letterSpacing = `${l.ls}px`;
  const lines = txt(l).split("\n"), widths = lines.map((s) => c.measureText(s).width), lh = l.size * l.lh;
  return { lines, widths, w: Math.max(1, ...widths), h: Math.max(lh, lines.length * lh), lh };
}
export function hit(l: Layer, x: number, y: number, pad: number) {
  const b = measure(l), r = (l.rot * Math.PI) / 180, dx = x - l.x, dy = y - l.y;
  return Math.abs(dx * Math.cos(r) + dy * Math.sin(r)) <= b.w / 2 + pad && Math.abs(-dx * Math.sin(r) + dy * Math.cos(r)) <= b.h / 2 + pad;
}

// ---------- painting
function paint(c: CanvasRenderingContext2D, f: Fill, w: number, h: number): string | CanvasGradient {
  if (f.type === "solid" || f.type === "none") return f.stops[0];
  let g: CanvasGradient;
  if (f.type === "radial") g = c.createRadialGradient(0, 0, 0, 0, 0, Math.max(w, h) / 2);
  else { const a = ((f.angle - 90) * Math.PI) / 180, len = Math.abs(w * Math.cos(a)) + Math.abs(h * Math.sin(a)); g = c.createLinearGradient(-Math.cos(a) * len / 2, -Math.sin(a) * len / 2, Math.cos(a) * len / 2, Math.sin(a) * len / 2); }
  f.stops.forEach((s, i) => g.addColorStop(i / (f.stops.length - 1), s)); return g;
}
export function drawBg(c: CanvasRenderingContext2D, d: Doc, img: HTMLImageElement | null) {
  const { w, h, bg } = d; if (bg.type === "transparent") return;
  c.save(); c.translate(w / 2, h / 2);
  if (bg.type === "image") {
    c.fillStyle = bg.c1; c.fillRect(-w / 2, -h / 2, w, h);
    if (img) { const k = (bg.fit === "cover" ? Math.max : Math.min)(w / img.width, h / img.height) * bg.scale; c.drawImage(img, (-img.width * k) / 2 + bg.ox, (-img.height * k) / 2 + bg.oy, img.width * k, img.height * k); }
  } else { c.fillStyle = paint(c, { type: bg.type, stops: [bg.c1, bg.c2], angle: bg.angle }, w, h); c.fillRect(-w / 2, -h / 2, w, h); }
  c.restore();
}
export function drawLayer(c: CanvasRenderingContext2D, l: Layer, s: number) {
  const m = measure(l, c), ax = l.align === "left" ? -m.w / 2 : l.align === "right" ? m.w / 2 : 0, y0 = -m.h / 2 + m.lh / 2;
  const x0 = (w: number) => (l.align === "left" ? ax : l.align === "right" ? ax - w : ax - w / 2);
  const each = (fn: (t: string, y: number) => void) => m.lines.forEach((t, i) => fn(t, y0 + i * m.lh));
  const sh = (color: string, blur: number, x = 0, y = 0) => { c.shadowColor = color; c.shadowBlur = blur * s; c.shadowOffsetX = x * s; c.shadowOffsetY = y * s; };
  const noSh = () => { c.shadowColor = "transparent"; c.shadowBlur = c.shadowOffsetX = c.shadowOffsetY = 0; };
  c.save(); c.translate(l.x, l.y); c.rotate((l.rot * Math.PI) / 180); c.globalAlpha = l.opacity; c.textBaseline = "middle"; c.textAlign = l.align; c.lineJoin = "round";
  if (l.hl.on) { c.fillStyle = l.hl.color; each((_, y) => { const i = Math.round((y - y0) / m.lh); c.fillRect(x0(m.widths[i]) - l.hl.pad, y - m.lh / 2, m.widths[i] + l.hl.pad * 2, m.lh); }); }
  if (l.extrude.on) { c.fillStyle = l.extrude.color; for (let d = l.extrude.depth; d >= 1; d--) { c.save(); c.translate(d, d); each((t, y) => c.fillText(t, ax, y)); c.restore(); } }
  if (l.fill.type !== "none") {
    c.fillStyle = paint(c, l.fill, m.w, m.h);
    if (l.glow.on) { sh(l.glow.color, l.glow.blur); each((t, y) => c.fillText(t, ax, y)); sh(l.glow.color, l.glow.blur / 2); each((t, y) => c.fillText(t, ax, y)); }
    if (l.shadow.on) { sh(l.shadow.color, l.shadow.blur, l.shadow.x, l.shadow.y); each((t, y) => c.fillText(t, ax, y)); }
    noSh(); each((t, y) => c.fillText(t, ax, y));
  }
  if (l.stroke.on) { c.lineWidth = l.stroke.w; c.strokeStyle = l.stroke.color; if (l.fill.type === "none" && l.glow.on) sh(l.glow.color, l.glow.blur); else if (l.fill.type === "none" && l.shadow.on) sh(l.shadow.color, l.shadow.blur, l.shadow.x, l.shadow.y); each((t, y) => c.strokeText(t, ax, y)); noSh(); }
  if (l.deco !== "none") { c.fillStyle = l.fill.stops[0]; each((_, y) => { const i = Math.round((y - y0) / m.lh), th = Math.max(1, l.size / 18); c.fillRect(x0(m.widths[i]), y + (l.deco === "underline" ? l.size * 0.42 : -th / 2), m.widths[i], th); }); }
  c.restore();
}
export function renderDoc(c: CanvasRenderingContext2D, d: Doc, img: HTMLImageElement | null, s: number, transparent = false) {
  c.setTransform(s, 0, 0, s, 0, 0); c.clearRect(0, 0, d.w, d.h);
  if (!transparent) drawBg(c, d, img);
  d.layers.forEach((l) => drawLayer(c, l, s));
}
export function resizeDoc(d: Doc, w: number, h: number): Doc {
  const cl = (n: number) => Math.round(Math.min(4096, Math.max(64, n || 64)));
  w = cl(w); h = cl(h);
  return { ...d, w, h, layers: d.layers.map((l) => ({ ...l, x: (l.x * w) / d.w, y: (l.y * h) / d.h })) };
}

export const MAX_SIDE = 8192;
export const outSize = (d: Doc, scale: number) => { const k = Math.min(scale, MAX_SIDE / Math.max(d.w, d.h)); return { k, w: Math.round(d.w * k), h: Math.round(d.h * k) }; };
