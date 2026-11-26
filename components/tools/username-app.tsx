"use client";
import { useDeferredValue, useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { THEMES, genUsernames, type UName, type UOpts } from "@/lib/username";
import { TEXT_STYLES } from "@/lib/style-utils";
import { useSaved } from "@/lib/use-saved";
import { CopyBtn, Field, StarBtn, Toggle, btn, btnP, card, inp } from "./ui";

export function UsernameApp() {
  const [keyword, setKeyword] = useState(""), [theme, setTheme] = useState("cool"), [numbers, setNumbers] = useState(true), [symbols, setSymbols] = useState(false);
  const [style, setStyle] = useState("none"), [sep, setSep] = useState<UOpts["sep"]>("mixed"), [max, setMax] = useState(0), [count, setCount] = useState(12), [nonce, setNonce] = useState(0);
  const [names, setNames] = useState<UName[]>([]);
  const kw = useDeferredValue(keyword), saved = useSaved<{ id: string; text: string }>("arofy-usernames");
  useEffect(() => { setNames(genUsernames({ keyword: kw, theme, numbers, symbols, style, sep, max, count })); }, [kw, theme, numbers, symbols, style, sep, max, count, nonce]);
  return (
    <div className="grid gap-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
      <div className="space-y-3 rounded-xl border border-line bg-surface p-4 lg:self-start">
        <Field label="Keyword or name (optional)"><input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. Luna Fox" maxLength={40} className={inp} /></Field>
        <Field label="Theme"><select value={theme} onChange={(e) => setTheme(e.target.value)} className={inp}>{Object.entries(THEMES).map(([k, t]) => <option key={k} value={k}>{t.label}</option>)}</select></Field>
        <Field label="Separator"><select value={sep} onChange={(e) => setSep(e.target.value as UOpts["sep"])} className={inp}><option value="mixed">Mixed</option><option value="none">None</option><option value="_">Underscore (_)</option><option value=".">Dot (.)</option></select></Field>
        <Field label="Unicode style"><select value={style} onChange={(e) => setStyle(e.target.value)} className={inp}><option value="none">None (plain letters)</option>{TEXT_STYLES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
        <Field label="Maximum length"><select value={max} onChange={(e) => setMax(+e.target.value)} className={inp}><option value={0}>No limit</option><option value={15}>15 (e.g. Xbox style limits)</option><option value={20}>20</option><option value={30}>30</option><option value={32}>32 (Discord / Steam)</option></select></Field>
        <Field label="How many"><select value={count} onChange={(e) => setCount(+e.target.value)} className={inp}>{[6, 12, 24, 48].map((n) => <option key={n} value={n}>{n} names</option>)}</select></Field>
        <Toggle label="Add numbers" v={numbers} on={setNumbers} /><Toggle label="Add decorative symbols" v={symbols} on={setSymbols} />
        <button onClick={() => setNonce((n) => n + 1)} className={`${btnP} w-full`}><RefreshCw size={14} />Regenerate</button>
      </div>
      <div className="min-w-0 space-y-6">
        <section aria-labelledby="un-h">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2"><h2 id="un-h" className="font-display text-2xl font-semibold tracking-tight">Results</h2><CopyBtn value={names.map((n) => n.text).join("\n")} label="Copy all" disabled={!names.length} /></div>
          {names.length ? <ul className="grid gap-2 sm:grid-cols-2">{names.map((n) => (
            <li key={n.text} className={`${card} flex items-center gap-2 !p-3`}>
              <div className="min-w-0 flex-1"><p className="break-all text-lg">{n.text}</p><p className="text-xs text-muted">{[...n.text].length} chars · {n.plain ? "Plain: works almost everywhere" : "Styled: some sites reject symbols"}</p></div>
              <StarBtn on={saved.has(n.text)} onClick={() => saved.toggle({ id: n.text, text: n.text })} label={n.text} /><CopyBtn value={n.text} aria={`Copy ${n.text}`} />
            </li>))}</ul> : <p className="rounded-xl border border-dashed border-line p-8 text-center text-muted">No names fit these settings. Try a longer maximum length or fewer decorations.</p>}
        </section>
        <section aria-labelledby="fav-h">
          <h2 id="fav-h" className="mb-3 font-display text-2xl font-semibold tracking-tight">Saved usernames</h2>
          {saved.items.length ? <ul className="grid gap-2 sm:grid-cols-2">{saved.items.map((s) => <li key={s.id} className={`${card} flex items-center gap-2 !p-3`}><p className="min-w-0 flex-1 break-all text-lg">{s.text}</p><CopyBtn value={s.text} aria={`Copy ${s.text}`} /><button className={btn} onClick={() => saved.remove(s.id)} aria-label={`Remove ${s.text}`}>Remove</button></li>)}</ul>
            : <p className="rounded-xl border border-dashed border-line p-6 text-muted">Tap the star on any name to save it. Favorites stay in this browser.</p>}
        </section>
      </div>
    </div>
  );
}
