"use client";
import { useEffect, type RefObject } from "react";
import { AlignCenter, AlignLeft, AlignRight, ArrowDown, ArrowUp, Copy, Download, Italic, Plus, Trash2, Upload } from "lucide-react";
import { FONTS, SIZES, outSize, renderDoc, resizeDoc, type Bg, type Doc, type Layer } from "@/lib/design";
import { PRESETS } from "@/lib/design-presets";
import { Col, Sec, Seg, Sl, Tog, ibtn, inp } from "./ui";

type Sub = "fill" | "shadow" | "glow" | "extrude" | "stroke" | "hl";
export type Api = {
  doc: Doc; L?: Layer; sel: string | null; setSel: (id: string) => void; taRef: RefObject<HTMLTextAreaElement | null>;
  update: (fn: (d: Doc) => Doc, key?: string) => void; edit: (p: Partial<Layer>, key?: string) => void; sub: (k: Sub, p: object, key?: string) => void;
  add: () => void; dup: () => void; del: () => void; move: (dir: 1 | -1) => void; hasImg: boolean; upload: (f: File | undefined) => void; clearImg: () => void;
  exp: { fmt: "png" | "svg"; scale: number; transparent: boolean; busy: boolean; status: string; set: (p: object) => void; run: () => void };
};
const SHADOWS: [string, object][] = [["Soft", { x: 0, y: 8, blur: 24, color: "#00000066" }], ["Hard", { x: 8, y: 8, blur: 0, color: "#000000" }], ["Lifted", { x: 0, y: 22, blur: 32, color: "#00000055" }], ["Long", { x: 28, y: 28, blur: 0, color: "#00000033" }]];
const GRADS: [string, string[]][] = [["Gold", ["#f8e08e", "#b8862b", "#fdf0b8", "#a67c1d"]], ["Chrome", ["#ffffff", "#8a8f98", "#f4f5f7", "#5c616b", "#d9dde3"]], ["Sunset", ["#ff9966", "#ff5e62", "#a855f7"]], ["Ocean", ["#22d3ee", "#3b82f6"]]];
const off = { on: false };

export function Panels({ a }: { a: Api }) {
  const { doc, L, edit, sub } = a, bg = doc.bg;
  const setBg = (p: Partial<Bg>, key?: string) => a.update((d) => ({ ...d, bg: { ...d.bg, ...p } }), key ? "bg" + key : "");
  const eff = (name: string) => {
    if (!L) return;
    const clear = { shadow: { ...L.shadow, on: false }, glow: { ...L.glow, on: false }, extrude: { ...L.extrude, on: false }, stroke: { ...L.stroke, on: false } };
    const solid = (c: string) => ({ type: "solid" as const, stops: [c, c], angle: 90 });
    if (name === "neon") edit({ ...clear, fill: solid("#ffffff"), glow: { on: true, blur: 34, color: "#ff2bd6" } });
    else if (name === "soft") edit({ ...clear, glow: { on: true, blur: 22, color: "#ffd9a0" } });
    else if (name === "metal") edit({ ...clear, fill: { type: "linear", stops: GRADS[1][1], angle: 90 }, stroke: { on: true, w: 3, color: "#0a0a0a" }, shadow: { on: true, x: 0, y: 12, blur: 18, color: "#000000aa" } });
    else if (name === "3d") edit({ ...clear, extrude: { on: true, depth: 16, color: "#1a1916" } });
    else edit(clear);
  };
  const stops = L?.fill.stops ?? [];
  const setStop = (i: number, c: string) => L && sub("fill", { stops: stops.map((s, j) => (j === i ? c : s)) });
  return (
    <div className="space-y-3">
      <Sec title="Layers" open>
        <ul className="space-y-1" aria-label="Layers">
          {[...doc.layers].reverse().map((l) => (
            <li key={l.id}><button onClick={() => a.setSel(l.id)} aria-pressed={a.sel === l.id} className={`flex min-h-10 w-full items-center rounded-lg border px-3 text-left text-sm ${a.sel === l.id ? "border-accent bg-sunk" : "border-line"}`}><span className="truncate">{l.text.replace(/\n/g, " ") || "(empty)"}</span></button></li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          <button onClick={a.add} title="Add text layer (T)" className="inline-flex min-h-10 items-center gap-1.5 rounded-lg bg-accent px-3 text-sm font-medium text-accent-fg hover:opacity-90"><Plus size={14} />Add text</button>
          <button onClick={a.dup} disabled={!L} title="Duplicate (Ctrl/⌘+D)" aria-label="Duplicate layer" className={ibtn}><Copy size={16} /></button>
          <button onClick={() => a.move(1)} disabled={!L} title="Bring forward (])" aria-label="Bring forward" className={ibtn}><ArrowUp size={16} /></button>
          <button onClick={() => a.move(-1)} disabled={!L} title="Send backward ([)" aria-label="Send backward" className={ibtn}><ArrowDown size={16} /></button>
          <button onClick={a.del} disabled={!L} title="Delete (Del)" aria-label="Delete layer" className={ibtn}><Trash2 size={16} /></button>
        </div>
      </Sec>
      {!L ? <p className="rounded-xl border border-dashed border-line p-4 text-sm text-muted">Select a layer on the canvas or in the list to edit its text, typography and effects.</p> : (
        <>
          <Sec title="Text &amp; typography" open>
            <label className="block text-sm font-medium" htmlFor="st-text">Text</label>
            <textarea id="st-text" ref={a.taRef} value={L.text} rows={3} onChange={(e) => edit({ text: e.target.value }, "text")} className={`${inp} resize-y py-2`} />
            <select aria-label="Font family" value={L.font} onChange={(e) => edit({ font: e.target.value })} className={inp}>{FONTS.map((f) => <option key={f.id} value={f.id}>{f.label}</option>)}</select>
            <div className="flex gap-2">
              <select aria-label="Font weight" value={L.weight} onChange={(e) => edit({ weight: +e.target.value })} className={inp}>{[100, 200, 300, 400, 500, 600, 700, 800, 900].map((w) => <option key={w} value={w}>Weight {w}</option>)}</select>
              <button aria-pressed={L.italic} aria-label="Italic" title="Italic" onClick={() => edit({ italic: !L.italic })} className={`grid size-10 shrink-0 place-items-center rounded-lg border ${L.italic ? "border-fg bg-fg text-bg" : "border-line"}`}><Italic size={16} /></button>
            </div>
            <Sl label="Size" v={L.size} min={8} max={600} on={(n) => edit({ size: n }, "size")} unit="px" />
            <Sl label="Letter spacing" v={L.ls} min={-10} max={80} on={(n) => edit({ ls: n }, "ls")} unit="px" />
            <Sl label="Line height" v={L.lh} min={0.6} max={3} step={0.05} on={(n) => edit({ lh: n }, "lh")} />
            <Sl label="Opacity" v={L.opacity} min={0} max={1} step={0.01} on={(n) => edit({ opacity: n }, "op")} />
            <div role="group" aria-label="Alignment" className="flex gap-2">{([["left", AlignLeft], ["center", AlignCenter], ["right", AlignRight]] as const).map(([k, I]) => <button key={k} aria-label={`Align ${k}`} title={`Align ${k}`} aria-pressed={L.align === k} onClick={() => edit({ align: k })} className={`grid h-10 flex-1 place-items-center rounded-lg border ${L.align === k ? "border-fg bg-fg text-bg" : "border-line"}`}><I size={16} /></button>)}</div>
            <Seg label="Letter case" v={L.caps} opts={[["none", "Normal"], ["upper", "UPPER"], ["lower", "lower"]]} on={(v) => edit({ caps: v })} />
          </Sec>
          <Sec title="Position">
            <Sl label="X" v={Math.round(L.x)} min={0} max={doc.w} on={(n) => edit({ x: n }, "x")} unit="px" />
            <Sl label="Y" v={Math.round(L.y)} min={0} max={doc.h} on={(n) => edit({ y: n }, "y")} unit="px" />
            <Sl label="Rotation" v={L.rot} min={-180} max={180} on={(n) => edit({ rot: n }, "rot")} unit="°" />
          </Sec>
          <Sec title="Fill &amp; gradients">
            <Seg label="Fill type" v={L.fill.type} opts={[["solid", "Solid"], ["linear", "Linear"], ["radial", "Radial"], ["none", "None"]]} on={(t) => sub("fill", { type: t })} />
            {L.fill.type !== "none" && stops.slice(0, L.fill.type === "solid" ? 1 : 9).map((c, i) => (
              <div key={i} className="flex items-center gap-2"><div className="flex-1"><Col label={L.fill.type === "solid" ? "Color" : `Stop ${i + 1}`} v={c} on={(v) => setStop(i, v)} /></div>
                {L.fill.type !== "solid" && stops.length > 2 && <button aria-label={`Remove stop ${i + 1}`} onClick={() => sub("fill", { stops: stops.filter((_, j) => j !== i) })} className={ibtn}><Trash2 size={14} /></button>}</div>
            ))}
            {(L.fill.type === "linear" || L.fill.type === "radial") && <>
              {L.fill.type === "linear" && <Sl label="Angle" v={L.fill.angle} min={0} max={360} on={(n) => sub("fill", { angle: n }, "angle")} unit="°" />}
              {stops.length < 6 && <button onClick={() => sub("fill", { stops: [...stops, stops[stops.length - 1]] })} className="min-h-10 rounded-lg border border-line px-3 text-sm hover:bg-sunk">Add color stop</button>}
              <div className="flex flex-wrap gap-2">{GRADS.map(([n, s]) => <button key={n} onClick={() => sub("fill", { type: "linear", stops: s, angle: 90 })} className="min-h-10 rounded-lg border border-line px-3 text-sm hover:bg-sunk">{n}</button>)}</div>
            </>}
          </Sec>
          <Sec title="Effects">
            <p className="text-xs font-medium uppercase tracking-wider text-muted">Quick looks</p>
            <div className="flex flex-wrap gap-2">{([["neon", "Neon glow"], ["soft", "Soft glow"], ["metal", "Metallic"], ["3d", "3D layers"], ["clear", "Clear effects"]] as const).map(([k, n]) => <button key={k} onClick={() => eff(k)} className="min-h-10 rounded-lg border border-line px-3 text-sm hover:bg-sunk">{n}</button>)}</div>
            <Tog label="Shadow" v={L.shadow.on} on={(b) => sub("shadow", { on: b })} />
            {L.shadow.on && <>
              <div className="flex flex-wrap gap-2">{SHADOWS.map(([n, p]) => <button key={n} onClick={() => sub("shadow", p)} className="min-h-9 rounded-lg border border-line px-3 text-xs hover:bg-sunk">{n}</button>)}</div>
              <Sl label="Offset X" v={L.shadow.x} min={-80} max={80} on={(n) => sub("shadow", { x: n }, "x")} /><Sl label="Offset Y" v={L.shadow.y} min={-80} max={80} on={(n) => sub("shadow", { y: n }, "y")} />
              <Sl label="Blur" v={L.shadow.blur} min={0} max={80} on={(n) => sub("shadow", { blur: n }, "b")} /><Col label="Shadow color" v={L.shadow.color} on={(c) => sub("shadow", { color: c })} />
            </>}
            <Tog label="Glow" v={L.glow.on} on={(b) => sub("glow", { on: b })} />
            {L.glow.on && <><Sl label="Glow size" v={L.glow.blur} min={2} max={120} on={(n) => sub("glow", { blur: n }, "b")} /><Col label="Glow color" v={L.glow.color} on={(c) => sub("glow", { color: c })} /></>}
            <Tog label="3D layered depth" v={L.extrude.on} on={(b) => sub("extrude", { on: b })} />
            {L.extrude.on && <><Sl label="Depth" v={L.extrude.depth} min={1} max={60} on={(n) => sub("extrude", { depth: n }, "d")} /><Col label="Depth color" v={L.extrude.color} on={(c) => sub("extrude", { color: c })} /></>}
            <Tog label="Outline" v={L.stroke.on} on={(b) => sub("stroke", { on: b })} />
            {L.stroke.on && <><Sl label="Stroke thickness" v={L.stroke.w} min={1} max={40} on={(n) => sub("stroke", { w: n }, "w")} unit="px" /><Col label="Stroke color" v={L.stroke.color} on={(c) => sub("stroke", { color: c })} /></>}
            <Tog label="Background highlight" v={L.hl.on} on={(b) => sub("hl", { on: b })} />
            {L.hl.on && <><Sl label="Highlight padding" v={L.hl.pad} min={0} max={80} on={(n) => sub("hl", { pad: n }, "p")} unit="px" /><Col label="Highlight color" v={L.hl.color} on={(c) => sub("hl", { color: c })} /></>}
            <Seg label="Decoration" v={L.deco} opts={[["none", "None"], ["underline", "Underline"], ["line-through", "Strike"]]} on={(v) => edit({ deco: v })} />
          </Sec>
        </>
      )}
      <Sec title="Canvas background">
        <Seg label="Background type" v={bg.type} opts={[["solid", "Solid"], ["linear", "Linear"], ["radial", "Radial"], ["transparent", "None"], ["image", "Image"]]} on={(t) => setBg({ type: t })} />
        {bg.type !== "transparent" && <Col label={bg.type === "solid" || bg.type === "image" ? "Color" : "Color 1"} v={bg.c1} on={(c) => setBg(bg.type === "solid" ? { c1: c, c2: c } : { c1: c })} />}
        {(bg.type === "linear" || bg.type === "radial") && <Col label="Color 2" v={bg.c2} on={(c) => setBg({ c2: c })} />}
        {bg.type === "linear" && <Sl label="Angle" v={bg.angle} min={0} max={360} on={(n) => setBg({ angle: n }, "a")} unit="°" />}
        {bg.type === "image" && <>
          <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-line px-3 text-sm hover:bg-sunk focus-within:outline-2 focus-within:outline-accent"><Upload size={14} />{a.hasImg ? "Replace image" : "Upload image"}<input type="file" accept="image/*" className="sr-only" onChange={(e) => { a.upload(e.target.files?.[0]); e.target.value = ""; }} /></label>
          {a.hasImg && <button onClick={a.clearImg} className="ml-2 min-h-10 rounded-lg border border-line px-3 text-sm hover:bg-sunk">Remove</button>}
          <Seg label="Image fit" v={bg.fit} opts={[["cover", "Cover"], ["contain", "Contain"]]} on={(v) => setBg({ fit: v })} />
          <Sl label="Scale" v={bg.scale} min={0.2} max={4} step={0.05} on={(n) => setBg({ scale: n }, "s")} unit="×" />
          <Sl label="Position X" v={bg.ox} min={-1500} max={1500} on={(n) => setBg({ ox: n }, "x")} /><Sl label="Position Y" v={bg.oy} min={-1500} max={1500} on={(n) => setBg({ oy: n }, "y")} />
        </>}
      </Sec>
      <Sec title="Canvas size">
        <select aria-label="Size preset" value={SIZES.find(([, w, h]) => w === doc.w && h === doc.h)?.[0] ?? "custom"} onChange={(e) => { const s = SIZES.find(([n]) => n === e.target.value); if (s) a.update((d) => resizeDoc(d, s[1], s[2])); }} className={inp}>
          <option value="custom" disabled>Custom</option>{SIZES.map(([n, w, h]) => <option key={n} value={n}>{n} · {w}×{h}</option>)}
        </select>
        <div className="flex items-center gap-2">
          <label className="flex-1 text-sm">Width<input type="number" min={64} max={4096} value={doc.w} onChange={(e) => a.update((d) => resizeDoc(d, +e.target.value, d.h))} className={inp} /></label>
          <label className="flex-1 text-sm">Height<input type="number" min={64} max={4096} value={doc.h} onChange={(e) => a.update((d) => resizeDoc(d, d.w, +e.target.value))} className={inp} /></label>
        </div>
      </Sec>
      <Sec title="Export" open>
        <Seg label="Format" v={a.exp.fmt} opts={[["png", "PNG"], ["svg", "SVG"]]} on={(fmt) => a.exp.set({ fmt })} />
        {a.exp.fmt === "png" && <label className="block text-sm">Resolution<select value={a.exp.scale} onChange={(e) => a.exp.set({ scale: +e.target.value })} className={inp}>{[1, 2, 3, 4].map((k) => { const o = outSize(doc, k); return <option key={k} value={k}>{k}× · {o.w}×{o.h}px</option>; })}</select></label>}
        <Tog label="Transparent background" v={a.exp.transparent || bg.type === "transparent"} on={(b) => a.exp.set({ transparent: b })} />
        <button onClick={a.exp.run} disabled={a.exp.busy} className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-accent px-4 text-sm font-medium text-accent-fg hover:opacity-90 disabled:opacity-60"><Download size={16} />{a.exp.busy ? "Exporting…" : `Download ${a.exp.fmt.toUpperCase()}`}</button>
        {a.exp.fmt === "svg" && <p className="text-xs text-muted">SVG keeps live, editable text. Fonts are referenced by name and are not embedded, so use PNG when exact fonts matter.</p>}
        <p role="status" className="min-h-4 text-xs text-muted">{a.exp.status}</p>
      </Sec>
      <Sec title="Keyboard shortcuts">
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm text-muted">
          {[["Ctrl/⌘ Z", "Undo"], ["Ctrl/⌘ Shift Z", "Redo"], ["Ctrl/⌘ D", "Duplicate"], ["Delete", "Delete layer"], ["Arrows", "Nudge (Shift = 10px)"], ["[  ]", "Send back / forward"], ["T", "Add text"], ["Ctrl/⌘ + − 0", "Zoom / fit"], ["Esc", "Deselect"], ["Double-click", "Edit text"]].map(([k, v]) => <div key={k} className="contents"><dt className="font-mono text-fg">{k}</dt><dd>{v}</dd></div>)}
        </dl>
      </Sec>
    </div>
  );
}
function Thumb({ id }: { id: string }) {
  return <canvas data-preset={id} className="block h-auto max-h-full w-full object-contain" />;
}
export function PresetGallery({ onApply, tick }: { onApply: (id: string) => void; tick: number }) {
  useEffect(() => {
    document.querySelectorAll<HTMLCanvasElement>("canvas[data-preset]").forEach((c) => {
      const p = PRESETS.find((x) => x.id === c.dataset.preset)!, d = p.doc(), s = (260 * Math.min(window.devicePixelRatio || 1, 2)) / Math.max(d.w, d.h);
      c.width = Math.round(d.w * s); c.height = Math.round(d.h * s); renderDoc(c.getContext("2d")!, d, null, s);
    });
  }, [tick]);
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {PRESETS.map((p) => (
        <li key={p.id}><button onClick={() => onApply(p.id)} className="group w-full overflow-hidden rounded-xl border border-line bg-surface text-left transition hover:border-accent/60 hover:shadow-sm">
          <div className="flex aspect-square items-center justify-center bg-sunk"><Thumb id={p.id} /></div>
          <span className="block px-3 py-2 text-sm font-medium">{p.name}</span>
        </button></li>
      ))}
    </ul>
  );
}
