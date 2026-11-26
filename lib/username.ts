import { applyStyle, styleById } from "./style-utils";
type Theme = { label: string; pre: string[]; suf: string[]; words: string[]; sym: string[] };
const w = (s: string) => s.split(" ");
export const THEMES: Record<string, Theme> = {
  cool: { label: "Cool", pre: w("Neo Ultra Prime Zero Apex Nova Hyper Alpha Echo Vibe"), suf: w("Prime X Zone Labs Hub Wave Core HQ Official Pro"), words: w("Frost Blaze Phantom Rogue Vortex Cipher Orbit Spectre"), sym: w("⚡ ✦ ◆ ★") },
  gaming: { label: "Gaming", pre: w("Pro Dark Epic Toxic Savage Ninja Elite Dire Rapid Mad"), suf: w("Gamer Slayer Clutch Wolf Sniper TV GG Rush Frag Boss"), words: w("Reaper Valkyrie Titan Glitch Raider Warden Havoc Striker"), sym: w("⚔ ☠ ♞ ✪") },
  aesthetic: { label: "Aesthetic", pre: w("luna soft velvet dreamy golden pastel cloud honey muted lilac"), suf: w("aesthetic dreams muse vibes bloom haze daze poet diary era"), words: w("moonlit petal serene willow amber opal ivory"), sym: w("✿ ☾ ♡ ✧") },
  cute: { label: "Cute", pre: w("tiny little bubble fluffy mochi sweet happy cozy pixie lucky"), suf: w("bean bunny pie boo paws cake sprout pop puff button"), words: w("panda kitten peach cupcake sprinkle pudding teddy"), sym: w("♡ ✿ ☆ ♪") },
  dark: { label: "Dark", pre: w("Shadow Night Grim Void Raven Crimson Dusk Hollow Obsidian Ghost"), suf: w("Reaper Hex Veil Fang Eclipse Wraith Omen Abyss Thorn Bane"), words: w("Nightfall Gloom Specter Cinder Nocturne Mortem Eerie"), sym: w("☠ ☾ ✠ ⚰") },
  professional: { label: "Professional", pre: w("The Real Official Studio Team Hello Just Mr Ms Dr Prof"), suf: w("Studio Works Co Digital Media Design Group Dev HQ Online"), words: w("Atlas Summit Harbor Beacon Pioneer Anchor Compass"), sym: [] },
};
export type UOpts = { keyword: string; theme: string; numbers: boolean; symbols: boolean; style: string; sep: "none" | "_" | "." | "mixed"; max: number; count: number };
export type UName = { text: string; plain: boolean };
const pick = <T,>(a: T[], r: () => number) => a[Math.floor(r() * a.length)];
const ri = (a: number, b: number, r: () => number) => a + Math.floor(r() * (b - a + 1));
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const lower = (s: string) => s.toLowerCase();

export function genUsernames(o: UOpts, rnd: () => number = Math.random): UName[] {
  const th = THEMES[o.theme] ?? THEMES.cool, kw = o.keyword.replace(/[^\p{L}\p{N} _.-]/gu, " ").split(/[ _.-]+/).filter(Boolean);
  const out = new Map<string, UName>(), style = styleById(o.style);
  for (let tries = 0; tries < o.count * 40 && out.size < o.count; tries++) {
    const base = kw.length ? (rnd() < 0.7 ? kw.join("") : pick(kw, rnd)) : pick(th.words, rnd);
    const sep = o.sep === "mixed" ? pick(["", "_", "."], rnd) : o.sep === "none" ? "" : o.sep;
    const P = pick(th.pre, rnd), S = pick(th.suf, rnd), W = pick(th.words, rnd);
    let core = pick([() => P + sep + base, () => base + sep + S, () => P + sep + base + sep + S, () => W + sep + base, () => base + sep + W, () => base, () => base.replace(/[aA]/g, "4").replace(/[eE]/g, "3").replace(/[oO]/g, "0")], rnd)();
    core = pick([lower, cap, (s: string) => s, (s: string) => s.replace(/(^|[_.])(\p{L})/gu, (_, a, b) => a + b.toUpperCase())], rnd)(core);
    if (o.numbers && rnd() < 0.65) core += pick([() => String(ri(1, 99, rnd)), () => String(ri(100, 9999, rnd)), () => String(ri(1990, 2012, rnd)), () => "x" + ri(1, 9, rnd)], rnd)();
    let name = core;
    if (o.symbols && th.sym.length) { const s = pick(th.sym, rnd); name = pick([`${s}${core}${s}`, `${core}${s}`, `${s}${core}`, `꧁${core}꧂`, `•${core}•`], rnd); }
    const text = applyStyle(style, name);
    if (o.max > 0 && [...text].length > o.max) continue;
    if (!out.has(text)) out.set(text, { text, plain: /^[A-Za-z0-9._]+$/.test(text) });
  }
  return [...out.values()];
}
