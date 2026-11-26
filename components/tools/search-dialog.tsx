"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { buildIndex, search, type Entry } from "@/lib/search";

export default function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const dlg = useRef<HTMLDialogElement>(null), input = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState(""), [i, setI] = useState(0);
  const index = useMemo(buildIndex, []), results = useMemo(() => search(index, q), [index, q]);
  useEffect(() => { const d = dlg.current!; if (open && !d.open) { d.showModal(); setQ(""); setI(0); requestAnimationFrame(() => input.current?.focus()); } else if (!open && d.open) d.close(); }, [open]);
  useEffect(() => { document.getElementById(`sr-${i}`)?.scrollIntoView({ block: "nearest" }); }, [i]);
  const go = (e?: Entry) => { if (!e) return; onClose(); window.location.assign(e.href); };
  const key = (e: React.KeyboardEvent) => {
    const n = results.length; if (!n) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setI((i + 1) % n); } else if (e.key === "ArrowUp") { e.preventDefault(); setI((i - 1 + n) % n); }
    else if (e.key === "Home") { e.preventDefault(); setI(0); } else if (e.key === "End") { e.preventDefault(); setI(n - 1); } else if (e.key === "Enter") { e.preventDefault(); go(results[i]); }
  };
  let last = "";
  return (
    <dialog ref={dlg} onClose={onClose} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }} aria-label="Search AROFY" className="mx-auto mb-auto mt-[10vh] w-[min(40rem,calc(100vw-2rem))] rounded-2xl border border-line bg-surface p-0 text-fg shadow-2xl backdrop:bg-black/40">
      <div className="flex items-center gap-3 border-b border-line px-4"><Search size={18} className="text-muted" aria-hidden />
        <input ref={input} value={q} onChange={(e) => { setQ(e.target.value); setI(0); }} onKeyDown={key} role="combobox" aria-expanded="true" aria-controls="sr-list" aria-activedescendant={results[i] ? `sr-${i}` : undefined} aria-autocomplete="list" aria-label="Search styles, symbols, tools, templates and presets" placeholder="Search styles, tools, templates, presets…" className="h-14 w-full bg-transparent text-base outline-none placeholder:text-muted" />
        <kbd className="hidden rounded border border-line px-1.5 py-0.5 text-xs text-muted sm:block">Esc</kbd></div>
      <ul id="sr-list" role="listbox" aria-label="Search results" className="max-h-[55vh] overflow-y-auto p-2">
        {results.map((r, n) => { const head = r.cat !== last && q.trim(); last = r.cat; return (
          <li key={r.id} role="presentation">
            {head && <p className="px-3 pb-1 pt-3 text-xs font-medium uppercase tracking-wider text-muted">{r.cat}</p>}
            <a id={`sr-${n}`} role="option" aria-selected={n === i} href={r.href} onClick={(e) => { e.preventDefault(); go(r); }} onMouseMove={() => setI(n)} className={`flex min-h-11 flex-col justify-center rounded-lg px-3 py-1.5 ${n === i ? "bg-sunk" : ""}`}><span className="text-sm font-medium">{r.title}</span><span className="truncate text-xs text-muted">{r.hint}</span></a>
          </li>); })}
        {!results.length && <li role="presentation" className="px-3 py-8 text-center text-sm text-muted">No results for “{q}”. Try “bold”, “slug”, “instagram” or “neon”.</li>}
      </ul>
      <p className="border-t border-line px-4 py-2 text-xs text-muted" aria-live="polite">{q.trim() ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Suggested tools"} · ↑↓ to move · Enter to open</p>
    </dialog>
  );
}
