"use client";
import { useId } from "react";
import { ChevronDown } from "lucide-react";

export const inp = "min-h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm";
export const ibtn = "grid size-10 place-items-center rounded-lg border border-line text-muted transition hover:bg-sunk hover:text-fg disabled:opacity-40 disabled:hover:bg-transparent";
export function Sec({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group rounded-xl border border-line bg-surface">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 text-sm font-semibold">{title}<ChevronDown size={16} className="text-muted transition group-open:rotate-180" /></summary>
      <div className="space-y-3 border-t border-line p-4">{children}</div>
    </details>
  );
}
export function Sl({ label, v, min, max, step = 1, on, unit = "" }: { label: string; v: number; min: number; max: number; step?: number; on: (n: number) => void; unit?: string }) {
  const id = useId();
  return <div><label htmlFor={id} className="flex justify-between text-sm"><span>{label}</span><span className="tabular-nums text-muted">{Math.round(v * 100) / 100}{unit}</span></label><input id={id} type="range" min={min} max={max} step={step} value={v} onChange={(e) => on(+e.target.value)} className="h-8 w-full accent-[var(--accent)]" /></div>;
}
export function Col({ label, v, on }: { label: string; v: string; on: (c: string) => void }) {
  return <label className="flex items-center justify-between gap-3 text-sm">{label}<input type="color" value={v.slice(0, 7)} onChange={(e) => on(e.target.value + v.slice(7))} className="h-10 w-14 cursor-pointer rounded-lg border border-line bg-transparent" /></label>;
}
export function Seg<T extends string>({ label, v, opts, on }: { label: string; v: T; opts: readonly (readonly [T, string])[]; on: (v: T) => void }) {
  return (
    <div role="group" aria-label={label} className="flex gap-1 rounded-lg border border-line p-1">
      {opts.map(([k, n]) => <button key={k} type="button" aria-pressed={v === k} onClick={() => on(k)} className={`min-h-9 flex-1 rounded-md px-2 text-xs font-medium transition ${v === k ? "bg-fg text-bg" : "text-muted hover:text-fg"}`}>{n}</button>)}
    </div>
  );
}
export function Tog({ label, v, on }: { label: string; v: boolean; on: (b: boolean) => void }) {
  return <label className="flex min-h-10 items-center gap-2 text-sm font-medium"><input type="checkbox" checked={v} onChange={(e) => on(e.target.checked)} className="size-4 accent-[var(--accent)]" />{label}</label>;
}
