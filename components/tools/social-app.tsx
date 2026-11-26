"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { PLATFORMS, VARIATION_STYLES, fillTemplate } from "@/lib/social";
import { TEXT_STYLES, applyStyle, styleById } from "@/lib/style-utils";
import { useSaved } from "@/lib/use-saved";
import { CopyBtn, Field, StarBtn, area, btn, card, inp } from "./ui";

const SYMBOLS = "✦ ✧ ★ ☆ ♡ ❤ ✿ ❀ ☾ ⚡ ✨ 🔥 → ➤ • ◆ ▪ ♪ ✔ ☕ 📍 📩 🎮 🔔".split(" ");
const GROUPS = [...new Set(PLATFORMS.map((p) => p.group))];

export function SocialApp() {
  const [pid, setPid] = useState(PLATFORMS[0].id), [tid, setTid] = useState(PLATFORMS[0].tpls[0].id), [name, setName] = useState(""), [topic, setTopic] = useState("");
  const [custom, setCustom] = useState<string | null>(null), [style, setStyle] = useState("none");
  const ta = useRef<HTMLTextAreaElement>(null), saved = useSaved<{ id: string; text: string; platform: string }>("arofy-social-saved");
  const plat = PLATFORMS.find((p) => p.id === pid) ?? PLATFORMS[0], tpl = plat.tpls.find((t) => t.id === tid) ?? plat.tpls[0];
  const text = custom ?? fillTemplate(tpl.body, name, topic);
  useEffect(() => { const f = () => { const p = PLATFORMS.find((x) => x.id === location.hash.slice(1)); if (p) { setPid(p.id); setTid(p.tpls[0].id); setCustom(null); } }; f(); addEventListener("hashchange", f); return () => removeEventListener("hashchange", f); }, []);
  const choosePlat = (id: string) => { const p = PLATFORMS.find((x) => x.id === id)!; setPid(id); setTid(p.tpls[0].id); setCustom(null); history.replaceState(null, "", `#${id}`); };
  const out = useMemo(() => applyStyle(styleById(style), text), [style, text]);
  const len = [...out].length, over = len - plat.limit, pct = Math.min(100, (len / plat.limit) * 100), u16 = out.length;
  const variations = useMemo(() => VARIATION_STYLES.map((id) => { const s = styleById(id)!, v = applyStyle(s, text); return { id, name: s.name, text: v, len: [...v].length }; }), [text]);
  const insert = (s: string) => { const el = ta.current, a = el?.selectionStart ?? text.length, b = el?.selectionEnd ?? text.length; setCustom(text.slice(0, a) + s + text.slice(b)); requestAnimationFrame(() => { el?.focus({ preventScroll: true }); el?.setSelectionRange(a + s.length, a + s.length); }); };
  const save = (t: string, id: string) => saved.toggle({ id: `${pid}:${id}:${t}`.slice(0, 300), text: t, platform: plat.name });
  return (
    <div className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-[18rem_minmax(0,1fr)]">
        <div className="space-y-3 rounded-xl border border-line bg-surface p-4 lg:self-start">
          <Field label="Platform & type"><select value={pid} onChange={(e) => choosePlat(e.target.value)} className={inp}>{GROUPS.map((g) => <optgroup key={g} label={g}>{PLATFORMS.filter((p) => p.group === g).map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</optgroup>)}</select></Field>
          <Field label="Your name or handle"><input value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Kim" maxLength={40} className={inp} /></Field>
          <Field label="Topic or niche"><input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="street photography" maxLength={40} className={inp} /></Field>
          <div><p className="mb-1 text-sm font-medium">Templates</p><ul className="space-y-1">{plat.tpls.map((t) => <li key={t.id}><button onClick={() => { setTid(t.id); setCustom(null); }} aria-pressed={t.id === tpl.id && custom === null} className={`min-h-10 w-full rounded-lg border px-3 text-left text-sm ${t.id === tpl.id && custom === null ? "border-accent bg-sunk" : "border-line hover:bg-sunk"}`}>{t.name}</button></li>)}</ul>
            {custom !== null && <button className={`${btn} mt-2 w-full`} onClick={() => setCustom(null)}>Restore template text</button>}</div>
        </div>
        <div className="min-w-0 space-y-4">
          <div>
            <div className="mb-1 flex flex-wrap items-baseline justify-between gap-2"><label htmlFor="sc-text" className="text-sm font-medium">Edit your text</label><span className="text-xs text-muted">{plat.limitLabel}</span></div>
            <textarea id="sc-text" ref={ta} value={text} onChange={(e) => setCustom(e.target.value)} rows={plat.limit > 500 ? 10 : 5} className={area} />
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sunk" aria-hidden><div className={`h-full ${over > 0 ? "bg-red-600" : "bg-accent"}`} style={{ width: `${pct}%` }} /></div>
            <p role="status" className={`mt-1 text-sm ${over > 0 ? "font-medium text-red-600 dark:text-red-400" : "text-muted"}`}>{len.toLocaleString()} / {plat.limit.toLocaleString()} characters{over > 0 ? ` · ${over.toLocaleString()} over the limit` : ` · ${(plat.limit - len).toLocaleString()} left`}{u16 !== len ? ` · styled letters may count as ${u16.toLocaleString()} on some platforms` : ""}</p>
          </div>
          <div><p className="mb-1 text-sm font-medium">Insert a symbol</p><div className="flex flex-wrap gap-1.5">{SYMBOLS.map((s) => <button key={s} onClick={() => insert(s)} aria-label={`Insert ${s}`} className="min-h-10 min-w-10 rounded-lg border border-line bg-surface text-lg hover:bg-sunk">{s}</button>)}</div></div>
          <div className={card}>
            <div className="mb-2 flex flex-wrap items-center gap-2"><Field label="Unicode style"><select value={style} onChange={(e) => setStyle(e.target.value)} className={`${inp} sm:w-56`}><option value="none">None (plain)</option>{TEXT_STYLES.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field></div>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted">Final text</p>
            <p className="whitespace-pre-wrap break-words text-lg">{out || <span className="text-muted">Nothing to show yet.</span>}</p>
            <div className="mt-3 flex flex-wrap gap-2"><CopyBtn primary value={out} /><StarBtn on={saved.has(`${pid}:final:${out}`.slice(0, 300))} onClick={() => save(out, "final")} label="final text" /></div>
          </div>
        </div>
      </div>
      <section aria-labelledby="var-h"><h2 id="var-h" className="font-display text-2xl font-semibold tracking-tight">Design variations</h2><p className="mb-3 mt-1 text-muted">Your current text in {variations.length} styles. Variations over the {plat.limit.toLocaleString()}-character limit are flagged.</p>
        <ul className="grid gap-3 md:grid-cols-2">{variations.map((v) => (
          <li key={v.id} className={`${card} flex items-start gap-2`}><div className="min-w-0 flex-1"><p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted">{v.name}{v.len > plat.limit && <span className="ml-2 normal-case tracking-normal text-red-600 dark:text-red-400">over limit by {v.len - plat.limit}</span>}</p><p className="max-h-40 overflow-auto whitespace-pre-wrap break-words">{v.text}</p></div>
            <StarBtn on={saved.has(`${pid}:${v.id}:${v.text}`.slice(0, 300))} onClick={() => save(v.text, v.id)} label={v.name} /><CopyBtn value={v.text} aria={`Copy ${v.name} variation`} /></li>))}</ul></section>
      <section aria-labelledby="sv-h"><h2 id="sv-h" className="mb-3 font-display text-2xl font-semibold tracking-tight">Saved</h2>
        {saved.items.length ? <ul className="grid gap-3 md:grid-cols-2">{saved.items.map((s) => <li key={s.id} className={`${card} flex items-start gap-2`}><div className="min-w-0 flex-1"><p className="mb-1 text-xs text-muted">{s.platform}</p><p className="max-h-32 overflow-auto whitespace-pre-wrap break-words">{s.text}</p></div><CopyBtn value={s.text} aria="Copy saved text" /><button className={btn} onClick={() => saved.remove(s.id)} aria-label="Remove saved text">Remove</button></li>)}</ul>
          : <p className="rounded-xl border border-dashed border-line p-6 text-muted">Tap the star on the final text or any variation to keep it. Favorites stay in this browser.</p>}</section>
    </div>
  );
}
