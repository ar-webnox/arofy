"use client";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import { TOOLS, TOOL_GROUPS, toolDefaults, type OptVal } from "@/lib/text-tools";
import { CopyBtn, Field, Toggle, area, btn, inp } from "./ui";

export function TextToolsApp() {
  const [id, setId] = useState("uppercase"), [text, setText] = useState(""), [opts, setOpts] = useState<Record<string, Record<string, OptVal>>>({});
  const dt = useDeferredValue(text);
  const tool = TOOLS.find((t) => t.id === id) ?? TOOLS[0];
  const o = useMemo(() => ({ ...toolDefaults(tool), ...opts[tool.id] }), [tool, opts]);
  const res = useMemo(() => tool.run(dt, o), [tool, dt, o]);
  useEffect(() => { const f = () => { const h = location.hash.slice(1); if (TOOLS.some((t) => t.id === h)) setId(h); }; f(); addEventListener("hashchange", f); return () => removeEventListener("hashchange", f); }, []);
  const pick = (x: string) => { setId(x); history.replaceState(null, "", `#${x}`); };
  const setOpt = (k: string, v: OptVal) => setOpts((p) => ({ ...p, [tool.id]: { ...p[tool.id], [k]: v } }));
  return (
    <div className="grid gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <nav aria-label="Text tools" className="hidden lg:block">
        {TOOL_GROUPS.map((g) => (
          <div key={g} className="mb-4"><p className="mb-1 px-3 text-xs font-medium uppercase tracking-wider text-muted">{g}</p>
            <ul>{TOOLS.filter((t) => t.group === g).map((t) => <li key={t.id}><button onClick={() => pick(t.id)} aria-current={t.id === tool.id ? "true" : undefined} className={`min-h-10 w-full rounded-lg px-3 text-left text-sm transition ${t.id === tool.id ? "bg-fg text-bg" : "text-muted hover:bg-sunk hover:text-fg"}`}>{t.name}</button></li>)}</ul></div>
        ))}
      </nav>
      <div className="min-w-0 space-y-4">
        <label className="block text-sm lg:hidden"><span className="mb-1 block font-medium">Tool</span>
          <select value={tool.id} onChange={(e) => pick(e.target.value)} className={inp}>{TOOL_GROUPS.map((g) => <optgroup key={g} label={g}>{TOOLS.filter((t) => t.group === g).map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}</optgroup>)}</select></label>
        <div><h2 className="font-display text-2xl font-semibold tracking-tight">{tool.name}</h2><p className="mt-1 text-muted">{tool.desc}</p></div>
        {tool.opts && (
          <div className="grid gap-3 rounded-xl border border-line bg-surface p-4 sm:grid-cols-2">
            {tool.opts.map((op) => op.type === "bool" ? <Toggle key={op.id} label={op.label} v={!!o[op.id]} on={(b) => setOpt(op.id, b)} />
              : op.type === "select" ? <Field key={op.id} label={op.label}><select value={String(o[op.id])} onChange={(e) => setOpt(op.id, e.target.value)} className={inp}>{op.choices!.map(([v, n]) => <option key={v} value={v}>{n}</option>)}</select></Field>
              : <Field key={op.id} label={op.label}><input value={String(o[op.id])} placeholder={op.ph} onChange={(e) => setOpt(op.id, e.target.value)} className={inp} /></Field>)}
          </div>
        )}
        <Field label="Input text"><textarea value={text} onChange={(e) => setText(e.target.value)} rows={7} spellCheck={false} placeholder="Type or paste your text…" className={area} /></Field>
        <div>
          <p className="mb-1 text-sm font-medium">Result</p>
          {res.stat ? (
            <div className="rounded-xl border border-line bg-surface p-5"><p className="font-display text-5xl font-semibold tabular-nums">{res.stat.value}</p><p className="mt-1 text-muted">{res.stat.label}</p></div>
          ) : <textarea readOnly value={res.out} rows={7} aria-label="Result" className={`${area} bg-sunk/50`} />}
          <p role="status" className="mt-2 min-h-5 text-sm text-muted">{res.note}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <CopyBtn primary value={res.out} label={res.stat ? "Copy result" : "Copy"} />
          {!res.stat && <button className={btn} disabled={!res.out} onClick={() => setText(res.out)}>Use result as input</button>}
          <button className={btn} onClick={() => { setText(""); setOpts((p) => ({ ...p, [tool.id]: {} })); }}><RotateCcw size={14} />Reset</button>
        </div>
      </div>
    </div>
  );
}
