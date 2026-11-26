"use client";
import { useRef, useState } from "react";
import { Check, Copy, Star } from "lucide-react";

export const inp = "min-h-10 w-full rounded-lg border border-line bg-surface px-3 text-sm";
export const area = `${inp} resize-y py-2 text-base leading-relaxed`;
export const btn = "inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-line px-3 text-sm font-medium transition hover:bg-sunk disabled:opacity-40 disabled:hover:bg-transparent";
export const btnP = "inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-accent px-4 text-sm font-medium text-accent-fg transition hover:opacity-90 disabled:opacity-40";
export const card = "rounded-xl border border-line bg-surface p-4";

export async function copyText(v: string) {
  try { await navigator.clipboard.writeText(v); return true; } catch {
    try { const a = document.createElement("textarea"); a.value = v; a.style.cssText = "position:fixed;opacity:0"; document.body.append(a); a.select(); const ok = document.execCommand("copy"); a.remove(); return ok; } catch { return false; }
  }
}
export function CopyBtn({ value, label = "Copy", primary, disabled, aria }: { value: string; label?: string; primary?: boolean; disabled?: boolean; aria?: string }) {
  const [s, setS] = useState<"idle" | "ok" | "err">("idle"), t = useRef<number | undefined>(undefined);
  const click = async () => { const ok = await copyText(value); setS(ok ? "ok" : "err"); clearTimeout(t.current); t.current = window.setTimeout(() => setS("idle"), 1800); };
  return (
    <button type="button" onClick={click} disabled={disabled || !value} aria-label={aria} className={primary ? btnP : btn}>
      {s === "ok" ? <Check size={14} /> : <Copy size={14} />}{s === "ok" ? "Copied" : s === "err" ? "Copy failed" : label}
      <span role="status" className="sr-only">{s === "ok" ? "Copied to clipboard" : s === "err" ? "Copy failed. Select the text and copy it manually." : ""}</span>
    </button>
  );
}
export function StarBtn({ on, onClick, label }: { on: boolean; onClick: () => void; label: string }) {
  return <button type="button" onClick={onClick} aria-pressed={on} aria-label={`${on ? "Remove from" : "Save to"} favorites: ${label}`} title={on ? "Saved" : "Save to favorites"} className="grid size-10 shrink-0 place-items-center rounded-lg border border-line transition hover:bg-sunk"><Star size={16} className={on ? "fill-accent text-accent" : "text-muted"} /></button>;
}
export function Toggle({ label, v, on }: { label: string; v: boolean; on: (b: boolean) => void }) {
  return <label className="flex min-h-10 items-center gap-2 text-sm"><input type="checkbox" checked={v} onChange={(e) => on(e.target.checked)} className="size-4 accent-[var(--accent)]" />{label}</label>;
}
export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm"><span className="mb-1 block font-medium">{label}</span>{children}</label>;
}
