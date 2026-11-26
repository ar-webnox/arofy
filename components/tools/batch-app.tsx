"use client";
import { useDeferredValue, useMemo, useState } from "react";
import { Download, RotateCcw } from "lucide-react";
import { BATCH_DEFAULTS, blocksToText, processBatch, type BOpts } from "@/lib/batch";
import { TEXT_STYLES } from "@/lib/style-utils";
import { CopyBtn, Field, Toggle, area, btn, inp } from "./ui";

export function BatchApp() {
  const [text, setText] = useState(""), [o, setO] = useState<BOpts>(BATCH_DEFAULTS), dt = useDeferredValue(text);
  const set = <K extends keyof BOpts>(k: K, v: BOpts[K]) => setO((p) => ({ ...p, [k]: v }));
  const { base, blocks } = useMemo(() => processBatch(dt, o), [dt, o]);
  const all = useMemo(() => blocksToText(blocks, o.headings), [blocks, o.headings]);
  const total = text.split(/\r?\n/).filter((l) => l.trim()).length;
  const download = () => { const u = URL.createObjectURL(new Blob([all], { type: "text/plain;charset=utf-8" })), a = document.createElement("a"); a.href = u; a.download = "arofy-batch.txt"; document.body.append(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 1500); };
  const toggleStyle = (id: string) => set("styles", o.styles.includes(id) ? o.styles.filter((s) => s !== id) : [...o.styles, id]);
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="min-w-0 space-y-4">
        <Field label="Your lines (one item per line)"><textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} spellCheck={false} placeholder={"Paste a list of names, titles or captions…\nEach line is styled independently."} className={area} /></Field>
        <fieldset><legend className="mb-2 text-sm font-medium">Unicode styles <span className="font-normal text-muted">({o.styles.length} selected{o.styles.length ? "" : " · plain text"})</span></legend>
          <div className="flex flex-wrap gap-2">{TEXT_STYLES.map((s) => <button key={s.id} type="button" aria-pressed={o.styles.includes(s.id)} onClick={() => toggleStyle(s.id)} className={`min-h-9 rounded-full border px-3 text-sm transition ${o.styles.includes(s.id) ? "border-fg bg-fg text-bg" : "border-line bg-surface text-muted hover:text-fg"}`}>{s.name}</button>)}</div></fieldset>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p role="status" className="text-sm text-muted">{total ? `${base.length} line${base.length === 1 ? "" : "s"} × ${blocks.length} style${blocks.length === 1 ? "" : "s"}${total !== base.length ? ` (${total - base.length} removed)` : ""}` : "Paste some lines to see results."}</p>
          <div className="flex flex-wrap gap-2"><CopyBtn primary value={base.length ? all : ""} label="Copy all" /><button className={btn} onClick={download} disabled={!base.length}><Download size={14} />Download TXT</button></div>
        </div>
        {base.length ? blocks.map((b) => (
          <section key={b.id} aria-label={b.name} className="rounded-xl border border-line bg-surface">
            <div className="flex items-center justify-between gap-2 border-b border-line px-4 py-2"><h3 className="text-sm font-semibold">{b.name}</h3><CopyBtn value={b.lines.join("\n")} aria={`Copy ${b.name} results`} /></div>
            <pre className="max-h-72 overflow-auto whitespace-pre-wrap break-words p-4 text-base leading-relaxed">{b.lines.join("\n")}</pre>
          </section>
        )) : <p className="rounded-xl border border-dashed border-line p-8 text-center text-muted">Your styled lines will appear here.</p>}
      </div>
      <div className="space-y-3 rounded-xl border border-line bg-surface p-4 lg:self-start">
        <h2 className="font-semibold">Options</h2>
        <Field label="Prefix"><input value={o.prefix} onChange={(e) => set("prefix", e.target.value)} placeholder="e.g. ✦ " className={inp} /></Field>
        <Field label="Suffix"><input value={o.suffix} onChange={(e) => set("suffix", e.target.value)} placeholder="e.g.  ✦" className={inp} /></Field>
        <div className="flex gap-2"><Field label="Numbering"><select value={o.numbering} onChange={(e) => set("numbering", e.target.value as BOpts["numbering"])} className={inp}><option value="none">None</option><option value="dot">1. 2. 3.</option><option value="paren">1) 2) 3)</option><option value="hash">#1 #2 #3</option></select></Field>
          <Field label="Start at"><input type="number" value={o.start} onChange={(e) => set("start", Math.round(+e.target.value) || 0)} className={inp} /></Field></div>
        <Field label="Sort lines"><select value={o.sort} onChange={(e) => set("sort", e.target.value as BOpts["sort"])} className={inp}><option value="none">Keep order</option><option value="asc">A → Z</option><option value="desc">Z → A</option></select></Field>
        <Toggle label="Remove duplicate lines" v={o.dedupe} on={(b) => set("dedupe", b)} /><Toggle label="Ignore case (sort & duplicates)" v={o.ic} on={(b) => set("ic", b)} />
        <Toggle label="Remove empty lines" v={o.skipEmpty} on={(b) => set("skipEmpty", b)} /><Toggle label="Trim each line" v={o.trim} on={(b) => set("trim", b)} /><Toggle label="Style headings in output" v={o.headings} on={(b) => set("headings", b)} />
        <button className={`${btn} w-full`} onClick={() => { setText(""); setO(BATCH_DEFAULTS); }}><RotateCcw size={14} />Reset</button>
      </div>
    </div>
  );
}
