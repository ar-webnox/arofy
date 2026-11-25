"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Check, Copy, Eraser, ArrowDown } from "lucide-react";
import { CATEGORIES, POPULAR, PRESETS, STYLES, type Style } from "@/lib/transforms";
import { SITE } from "@/lib/site";

type Ctx = { text: string; setText: (t: string) => void; cat: string; setCat: (c: string) => void; copied: string; copy: (id: string, v: string) => void };
const Studio = createContext<Ctx | null>(null);
const useStudio = () => { const c = useContext(Studio); if (!c) throw new Error("StudioProvider missing"); return c; };

export function StudioProvider({ children }: { children: React.ReactNode }) {
  const [text, setText] = useState("");
  const [cat, setCat] = useState("all");
  const [copied, setCopied] = useState("");
  const copy = async (id: string, v: string) => {
    try { await navigator.clipboard.writeText(v); } catch {
      const a = document.createElement("textarea"); a.value = v; document.body.append(a); a.select(); document.execCommand("copy"); a.remove();
    }
    setCopied(id); setTimeout(() => setCopied((c) => (c === id ? "" : c)), 1600);
  };
  useEffect(() => {
    const go = () => {
      const m = location.hash.match(/^#cat-(\w+)$/);
      if (m && CATEGORIES.some(([id]) => id === m[1])) { setCat(m[1]); document.getElementById("styles")?.scrollIntoView(); }
    };
    go(); addEventListener("hashchange", go); return () => removeEventListener("hashchange", go);
  }, []);
  return <Studio.Provider value={{ text, setText, cat, setCat, copied, copy }}>{children}</Studio.Provider>;
}

const SAMPLE = "Your text here";
function StyleCard({ s }: { s: Style }) {
  const { text, copied, copy } = useStudio();
  const out = s.fn(text || SAMPLE);
  const done = copied === s.id;
  return (
    <li className="group flex items-start justify-between gap-3 rounded-xl border border-line bg-surface p-4 transition hover:border-accent/50 hover:shadow-sm">
      <div className="min-w-0">
        <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted">{s.name}</p>
        <p className={`whitespace-pre-wrap break-words text-lg leading-snug ${text ? "" : "text-muted"}`}>{out}</p>
      </div>
      <button onClick={() => copy(s.id, out)} aria-label={`Copy ${s.name} text`} className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition ${done ? "bg-accent text-accent-fg" : "border border-line hover:bg-sunk"}`}>
        {done ? <Check size={14} /> : <Copy size={14} />}{done ? "Copied" : "Copy"}
      </button>
    </li>
  );
}

export function Hero() {
  const { text, setText } = useStudio();
  const demo = useMemo(() => ["bscript", "bold", "bubble", "fraktur"].map((id) => STYLES.find((s) => s.id === id)!), []);
  return (
    <section id="top" className="mx-auto max-w-6xl px-4 pb-14 pt-16 sm:px-6 sm:pt-24">
      <p className="mb-4 text-sm font-medium text-accent">Free Unicode text styler</p>
      <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">{SITE.tagline}</h1>
      <p className="mt-5 max-w-xl text-lg text-muted">{SITE.name} converts plain words into dozens of typographic styles you can copy and paste into any app.</p>
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <div className="rounded-2xl border border-line bg-surface p-3 shadow-sm">
          <label htmlFor="hero-input" className="sr-only">Text to style</label>
          <input id="hero-input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or paste your text…" className="w-full rounded-xl bg-transparent px-3 py-3 text-lg outline-none placeholder:text-muted" />
          <a href="#styles" className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 font-medium text-accent-fg transition hover:opacity-90">Start styling <ArrowDown size={16} /></a>
        </div>
        <ul aria-label="Style preview" className="grid grid-cols-2 gap-3">
          {demo.map((s) => (
            <li key={s.id} className="truncate rounded-xl border border-line bg-surface px-4 py-3 text-lg">{s.fn(text || "Arofy")}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Workspace() {
  const { text, setText, cat, setCat } = useStudio();
  const list = cat === "all" ? STYLES : STYLES.filter((s) => s.cat === cat);
  const label = CATEGORIES.find(([id]) => id === cat)![1];
  return (
    <section id="styles" aria-labelledby="ws-h" className="border-y border-line bg-sunk/50 py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="ws-h" className="font-display text-3xl font-semibold tracking-tight">Text style workspace</h2>
        <div className="mt-6 rounded-2xl border border-line bg-surface p-4 shadow-sm">
          <label htmlFor="ws-input" className="sr-only">Your text</label>
          <textarea id="ws-input" value={text} onChange={(e) => setText(e.target.value)} rows={3} maxLength={500} placeholder="Type or paste your text…" className="w-full resize-y bg-transparent text-xl outline-none placeholder:text-muted" />
          <div className="flex items-center justify-between border-t border-line pt-3 text-sm text-muted">
            <span aria-live="polite">{[...text].length}/500 characters</span>
            <button onClick={() => setText("")} disabled={!text} className="flex items-center gap-1.5 rounded-md px-2 py-1 transition hover:text-fg disabled:opacity-40"><Eraser size={14} />Clear</button>
          </div>
        </div>
        <div role="tablist" aria-label="Style categories" className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
          {CATEGORIES.map(([id, name]) => (
            <button key={id} role="tab" id={`tab-${id}`} aria-selected={cat === id} aria-controls="style-panel" onClick={() => setCat(id)}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition ${cat === id ? "border-fg bg-fg text-bg" : "border-line bg-surface text-muted hover:text-fg"}`}>{name}</button>
          ))}
        </div>
        <div id="style-panel" role="tabpanel" aria-labelledby={`tab-${cat}`} className="mt-4">
          <p className="mb-3 text-sm text-muted">{list.length} {label.toLowerCase()} {list.length === 1 ? "style" : "styles"}</p>
          <ul className="grid gap-3 md:grid-cols-2">{list.map((s) => <StyleCard key={s.id} s={s} />)}</ul>
        </div>
      </div>
    </section>
  );
}

export function Popular() {
  return (
    <section aria-labelledby="pop-h" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 id="pop-h" className="font-display text-3xl font-semibold tracking-tight">Popular styles</h2>
      <p className="mt-2 text-muted">The most-copied looks, updated live with your text.</p>
      <ul className="mt-6 grid gap-3 md:grid-cols-2">{POPULAR.map((id) => <StyleCard key={id} s={STYLES.find((s) => s.id === id)!} />)}</ul>
    </section>
  );
}

export function Presets() {
  const { setText, setCat } = useStudio();
  return (
    <section aria-labelledby="pre-h" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <h2 id="pre-h" className="font-display text-3xl font-semibold tracking-tight">Featured typography presets</h2>
      <p className="mt-2 text-muted">One click loads sample text and the style family that suits it.</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {PRESETS.map((p) => {
          const s = STYLES.find((x) => x.cat === p.cat)!;
          return (
            <li key={p.label}>
              <button onClick={() => { setText(p.text); setCat(p.cat); document.getElementById("styles")?.scrollIntoView({ behavior: "smooth" }); }} className="h-full w-full rounded-xl border border-line bg-surface p-4 text-left transition hover:border-accent/50 hover:shadow-sm">
                <span className="text-xs font-medium uppercase tracking-wider text-muted">{p.label}</span>
                <span className="mt-2 block break-words text-xl">{s.fn(p.text)}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
