"use client";
import { useEffect, useRef } from "react";
import { hit, measure, renderDoc, type Doc } from "@/lib/design";

type Drag = { kind: "move" | "scale" | "rot"; id: string; sx: number; sy: number; lx: number; ly: number; size: number; d0: number };
type Props = { doc: Doc; img: HTMLImageElement | null; sel: string | null; zoom: number; tick: number; setSel: (id: string | null) => void; update: (fn: (d: Doc) => Doc, key?: string) => void; onEdit: () => void };

export function Stage({ doc, img, sel, zoom, tick, setSel, update, onEdit }: Props) {
  const cv = useRef<HTMLCanvasElement>(null), wrap = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const c = cv.current!, dpr = Math.min(window.devicePixelRatio || 1, 2), s = Math.min(zoom * dpr, 4096 / Math.max(doc.w, doc.h));
    c.width = Math.round(doc.w * s); c.height = Math.round(doc.h * s);
    const x = c.getContext("2d")!; x.imageSmoothingQuality = "high"; renderDoc(x, doc, img, s);
  }, [doc, img, zoom, tick]);

  const pt = (e: { clientX: number; clientY: number }) => { const r = wrap.current!.getBoundingClientRect(); return { x: (e.clientX - r.left) / zoom, y: (e.clientY - r.top) / zoom }; };
  const patch = (id: string, p: Partial<{ x: number; y: number; size: number; rot: number }>, key: string) => update((d) => ({ ...d, layers: d.layers.map((l) => (l.id === id ? { ...l, ...p } : l)) }), key);
  const start = (d: Drag) => {
    const mv = (e: PointerEvent) => {
      const p = pt(e);
      if (d.kind === "move") patch(d.id, { x: Math.round(d.lx + p.x - d.sx), y: Math.round(d.ly + p.y - d.sy) }, "drag" + d.id);
      else if (d.kind === "scale") patch(d.id, { size: Math.round(Math.min(1200, Math.max(8, (d.size * Math.hypot(p.x - d.lx, p.y - d.ly)) / d.d0))) }, "scale" + d.id);
      else { let a = (Math.atan2(p.y - d.ly, p.x - d.lx) * 180) / Math.PI + 90; if (e.shiftKey) a = Math.round(a / 15) * 15; patch(d.id, { rot: Math.round(((((a + 180) % 360) + 360) % 360) - 180) }, "rot" + d.id); }
    };
    const up = () => { removeEventListener("pointermove", mv); removeEventListener("pointerup", up); removeEventListener("pointercancel", up); };
    addEventListener("pointermove", mv); addEventListener("pointerup", up); addEventListener("pointercancel", up);
  };
  const down = (e: React.PointerEvent) => {
    const p = pt(e), pad = Math.max(8, 14 / zoom), l = [...doc.layers].reverse().find((q) => hit(q, p.x, p.y, pad));
    if (!l) { setSel(null); return; }
    setSel(l.id); start({ kind: "move", id: l.id, sx: p.x, sy: p.y, lx: l.x, ly: l.y, size: l.size, d0: 1 });
  };
  const L = doc.layers.find((l) => l.id === sel), b = L ? measure(L) : null;
  const handle = (kind: "scale" | "rot", cls: string, label: string) => (
    <button type="button" aria-label={label} title={label} style={{ touchAction: "none" }} className={`pointer-events-auto absolute size-4 rounded-full border-2 border-accent bg-bg ${cls}`}
      onPointerDown={(e) => { e.stopPropagation(); e.preventDefault(); if (!L) return; const p = pt(e); start({ kind, id: L.id, sx: p.x, sy: p.y, lx: L.x, ly: L.y, size: L.size, d0: Math.max(1, Math.hypot(p.x - L.x, p.y - L.y)) }); }} />
  );
  const checker = doc.bg.type === "transparent" ? { backgroundImage: "conic-gradient(#d4d4d4 25%,#fff 0 50%,#d4d4d4 0 75%,#fff 0)", backgroundSize: "20px 20px" } : undefined;
  return (
    <div ref={wrap} className="relative shadow-lg ring-1 ring-line" style={{ width: doc.w * zoom, height: doc.h * zoom, touchAction: "none", ...checker }} onPointerDown={down} onDoubleClick={onEdit}>
      <canvas ref={cv} role="img" aria-label="Design canvas" style={{ width: "100%", height: "100%", display: "block" }} />
      {L && b && (
        <div className="pointer-events-none absolute border border-dashed border-accent" style={{ left: (L.x - b.w / 2) * zoom, top: (L.y - b.h / 2) * zoom, width: b.w * zoom, height: b.h * zoom, transform: `rotate(${L.rot}deg)` }}>
          {handle("scale", "-bottom-2 -right-2 cursor-nwse-resize", "Resize (drag)")}
          {handle("scale", "-left-2 -top-2 cursor-nwse-resize", "Resize (drag)")}
          {handle("rot", "-top-8 left-1/2 -ml-2 cursor-grab", "Rotate (drag, Shift snaps to 15°)")}
        </div>
      )}
    </div>
  );
}
