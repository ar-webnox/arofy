"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, Redo2, RotateCcw, Undo2, ZoomIn, ZoomOut } from "lucide-react";
import { defaultDoc, loadFonts, mkLayer, type Doc, type Layer } from "@/lib/design";
import { PRESETS } from "@/lib/design-presets";
import { PresetGallery, Panels, type Api } from "./panels";
import { Stage } from "./stage";
import { ibtn } from "./ui";

type H = { past: Doc[]; cur: Doc; future: Doc[] };
type Img = { el: HTMLImageElement; src: string };
const rid = () => Math.random().toString(36).slice(2, 9);

export default function StudioApp() {
  const [h, setH] = useState<H>(() => ({ past: [], cur: defaultDoc(), future: [] }));
  const hr = useRef(h), last = useRef({ key: "", t: 0 });
  const apply = useCallback((n: H) => { hr.current = n; setH(n); }, []);
  const doc = h.cur;
  const [sel, setSel] = useState<string | null>(() => hr.current.cur.layers[0].id);
  const [zoom, setZoom] = useState(0.5), [fit, setFit] = useState(true), [tick, setTick] = useState(0), [img, setImg] = useState<Img | null>(null);
  const [fmt, setFmt] = useState<"png" | "svg">("png"), [scale, setScale] = useState(2), [transparent, setTransparent] = useState(false), [busy, setBusy] = useState(false), [status, setStatus] = useState("");
  const box = useRef<HTMLDivElement>(null), taRef = useRef<HTMLTextAreaElement>(null), selRef = useRef(sel);
  selRef.current = sel;
  const L = doc.layers.find((l) => l.id === sel);

  const update = useCallback((fn: (d: Doc) => Doc, key = "") => {
    const s = hr.current, next = fn(s.cur); if (next === s.cur) return;
    const now = Date.now(), merge = !!key && last.current.key === key && now - last.current.t < 800;
    last.current = { key, t: now };
    apply({ past: merge ? s.past : [...s.past.slice(-79), s.cur], cur: next, future: [] });
  }, [apply]);
  const patchSel = (fn: (l: Layer) => Layer, key = "") => update((d) => ({ ...d, layers: d.layers.map((l) => (l.id === selRef.current ? fn(l) : l)) }), key && `${selRef.current}:${key}`);
  const undo = () => { const s = hr.current; if (s.past.length) apply({ past: s.past.slice(0, -1), cur: s.past[s.past.length - 1], future: [s.cur, ...s.future] }); };
  const redo = () => { const s = hr.current; if (s.future.length) apply({ past: [...s.past, s.cur], cur: s.future[0], future: s.future.slice(1) }); };

  const add = () => { const d = hr.current.cur, l = mkLayer({ text: "New text", size: 96, x: d.w / 2, y: d.h / 2 + ((d.layers.length * 60) % 300), fill: { type: "solid", stops: ["#1a1916", "#1a1916"], angle: 90 } }); update((x) => ({ ...x, layers: [...x.layers, l] })); setSel(l.id); };
  const dup = () => { const c = hr.current.cur.layers.find((l) => l.id === selRef.current); if (!c) return; const n = mkLayer({ ...c, id: rid(), x: c.x + 30, y: c.y + 30 }); update((d) => ({ ...d, layers: [...d.layers, n] })); setSel(n.id); };
  const del = () => { const id = selRef.current; if (!id) return; update((d) => ({ ...d, layers: d.layers.filter((l) => l.id !== id) })); setSel(null); };
  const move = (dir: 1 | -1) => update((d) => { const i = d.layers.findIndex((l) => l.id === selRef.current), j = i + dir; if (i < 0 || j < 0 || j >= d.layers.length) return d; const a = [...d.layers]; [a[i], a[j]] = [a[j], a[i]]; return { ...d, layers: a }; });
  const nudge = (dx: number, dy: number) => patchSel((l) => ({ ...l, x: l.x + dx, y: l.y + dy }), "nudge");
  const zoomBy = (k: number) => { setFit(false); setZoom((z) => Math.min(4, Math.max(0.05, z * k))); };
  const fitNow = () => setFit(true);
  const editText = () => { taRef.current?.focus(); taRef.current?.select(); };
  const reset = () => { update(() => defaultDoc()); setSel(null); setImg(null); setFit(true); setStatus("Workspace reset. Undo brings your design back."); };
  const applyPreset = (id: string) => { const p = PRESETS.find((x) => x.id === id); if (!p) return; update(() => p.doc()); setSel(null); setFit(true); setStatus(`Applied “${p.name}”. Undo restores your previous design.`); };

  const upload = (f?: File) => {
    if (!f) return;
    if (!f.type.startsWith("image/") || f.size > 20e6) { setStatus("Choose an image file under 20 MB."); return; }
    const r = new FileReader();
    r.onload = () => { const src = String(r.result), el = new Image(); el.onload = () => { setImg({ el, src }); update((d) => ({ ...d, bg: { ...d.bg, type: "image", scale: 1, ox: 0, oy: 0 } })); setStatus("Background image added."); }; el.onerror = () => setStatus("That image couldn't be loaded."); el.src = src; };
    r.onerror = () => setStatus("That file couldn't be read."); r.readAsDataURL(f);
  };
  const run = async () => {
    setBusy(true); setStatus("");
    try {
      const m = await import("@/lib/design-export"); let href: string; const name = `arofy-design.${fmt}`;
      if (fmt === "png") href = URL.createObjectURL(await m.exportPng(doc, img?.el ?? null, scale, transparent));
      else href = URL.createObjectURL(new Blob([m.toSvg(doc, img?.el ?? null, img?.src ?? "", transparent)], { type: "image/svg+xml" }));
      m.download(href, name); setTimeout(() => URL.revokeObjectURL(href), 2000); setStatus(`Downloaded ${name}`);
    } catch (e) { setStatus("Export failed: " + (e instanceof Error ? e.message : "unknown error")); } finally { setBusy(false); }
  };

  // fonts → redraw once they are actually loaded
  const fkey = doc.layers.map((l) => `${l.font}${l.weight}${l.italic}`).join("|");
  useEffect(() => { let ok = true; loadFonts(hr.current.cur.layers).then(() => ok && setTick((t) => t + 1)); return () => { ok = false; }; }, [fkey]);
  // fit-to-screen
  useEffect(() => {
    if (!fit) return; const el = box.current!;
    const f = () => setZoom(Math.max(0.05, Math.min((el.clientWidth - 34) / doc.w, (el.clientHeight - 34) / doc.h, 2)));
    f(); const ro = new ResizeObserver(f); ro.observe(el); return () => ro.disconnect();
  }, [fit, doc.w, doc.h]);
  // ctrl+wheel zoom
  useEffect(() => { const el = box.current!, w = (e: WheelEvent) => { if (!e.ctrlKey && !e.metaKey) return; e.preventDefault(); zoomBy(e.deltaY < 0 ? 1.1 : 1 / 1.1); }; el.addEventListener("wheel", w, { passive: false }); return () => el.removeEventListener("wheel", w); }, []);
  // shortcuts
  const api = useRef({ undo, redo, dup, del, move, nudge, add, zoomBy, fitNow });
  api.current = { undo, redo, dup, del, move, nudge, add, zoomBy, fitNow };
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement, key = e.key.toLowerCase(), mod = e.ctrlKey || e.metaKey, A = api.current;
      if (t.matches?.("textarea,select,input:not([type=range]):not([type=color]):not([type=checkbox]):not([type=file])")) return;
      if (key.startsWith("arrow") && t.matches?.("input[type=range]")) return;
      let used = true;
      if (mod && key === "z" && !e.shiftKey) A.undo(); else if (mod && (key === "y" || (key === "z" && e.shiftKey))) A.redo();
      else if (mod && key === "d") A.dup(); else if (mod && (key === "=" || key === "+")) A.zoomBy(1.2); else if (mod && key === "-") A.zoomBy(1 / 1.2); else if (mod && key === "0") A.fitNow();
      else if (mod) used = false;
      else if (key === "delete" || key === "backspace") A.del(); else if (key === "]") A.move(1); else if (key === "[") A.move(-1); else if (key === "t") A.add();
      else if (key.startsWith("arrow")) { const s = e.shiftKey ? 10 : 1; A.nudge(key === "arrowleft" ? -s : key === "arrowright" ? s : 0, key === "arrowup" ? -s : key === "arrowdown" ? s : 0); }
      else if (key === "escape") setSel(null); else used = false;
      if (used) e.preventDefault();
    };
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  }, []);

  const panelApi: Api = {
    doc, L, sel, setSel, taRef, update, hasImg: !!img, upload, clearImg: () => { setImg(null); update((d) => ({ ...d, bg: { ...d.bg, type: "solid" } })); },
    edit: (p, key) => patchSel((l) => ({ ...l, ...p }), key),
    sub: (k, p, key) => patchSel((l) => ({ ...l, [k]: { ...l[k], ...p } }), key ? k + key : ""),
    add, dup, del, move, exp: { fmt, scale, transparent, busy, status, set: (p) => { const q = p as Partial<{ fmt: "png" | "svg"; scale: number; transparent: boolean }>; if (q.fmt) setFmt(q.fmt); if (q.scale) setScale(q.scale); if (q.transparent !== undefined) setTransparent(q.transparent); }, run },
  };
  return (
    <div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="min-w-0 space-y-3 lg:sticky lg:top-20 lg:self-start">
          <div role="toolbar" aria-label="Canvas tools" className="flex flex-wrap items-center gap-2">
            <button onClick={undo} disabled={!h.past.length} title="Undo (Ctrl/⌘+Z)" aria-label="Undo" className={ibtn}><Undo2 size={16} /></button>
            <button onClick={redo} disabled={!h.future.length} title="Redo (Ctrl/⌘+Shift+Z)" aria-label="Redo" className={ibtn}><Redo2 size={16} /></button>
            <span className="mx-1 h-6 w-px bg-line" aria-hidden />
            <button onClick={() => zoomBy(1 / 1.2)} title="Zoom out (Ctrl/⌘ −)" aria-label="Zoom out" className={ibtn}><ZoomOut size={16} /></button>
            <span className="min-w-12 text-center text-sm tabular-nums text-muted" aria-live="polite">{Math.round(zoom * 100)}%</span>
            <button onClick={() => zoomBy(1.2)} title="Zoom in (Ctrl/⌘ +)" aria-label="Zoom in" className={ibtn}><ZoomIn size={16} /></button>
            <button onClick={fitNow} title="Fit to screen (Ctrl/⌘ 0)" aria-label="Fit to screen" aria-pressed={fit} className={ibtn}><Maximize2 size={16} /></button>
            <button onClick={() => { setFit(false); setZoom(1); }} title="Actual size" className="min-h-10 rounded-lg border border-line px-3 text-sm text-muted hover:bg-sunk hover:text-fg">100%</button>
            <button onClick={reset} title="Reset workspace (undoable)" className="ml-auto inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-line px-3 text-sm text-muted hover:bg-sunk hover:text-fg"><RotateCcw size={14} />Reset</button>
          </div>
          <div ref={box} className="h-[60vh] min-h-80 overflow-auto rounded-xl border border-line bg-sunk p-4 lg:h-[calc(100vh-11rem)]">
            <div className="flex min-h-full w-max min-w-full"><div className="m-auto"><Stage doc={doc} img={img?.el ?? null} sel={sel} zoom={zoom} tick={tick} setSel={setSel} update={update} onEdit={editText} /></div></div>
          </div>
        </div>
        <div className="min-w-0 lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto lg:pr-1"><Panels a={panelApi} /></div>
      </div>
      <section aria-labelledby="pg-h" className="mt-12">
        <h2 id="pg-h" className="font-display text-3xl font-semibold tracking-tight">Design presets</h2>
        <p className="mb-5 mt-2 max-w-2xl text-muted">Twelve complete starting points. Applying one replaces the canvas (Undo brings your design back) and every property stays editable.</p>
        <PresetGallery onApply={applyPreset} tick={tick} />
      </section>
    </div>
  );
}
