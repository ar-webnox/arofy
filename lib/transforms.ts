export type Style = { id: string; name: string; cat: string; fn: (t: string) => string };
export const CATEGORIES = [
  ["all","All Styles"],["fancy","Fancy"],["cursive","Cursive"],["bold","Bold"],["italic","Italic"],["gothic","Gothic"],
  ["small","Small Text"],["bubble","Bubble Text"],["mono","Monospace"],["super","Superscript"],["sub","Subscript"],
  ["glitch","Glitch"],["decorative","Decorative"],["symbols","Symbols"],["art","Text Art"],
] as const;

const alpha = (U: number, L: number, D?: number, ex: Record<string, string> = {}) => (t: string) =>
  [...t].map((c) => {
    if (ex[c]) return ex[c];
    const k = c.charCodeAt(0);
    if (k >= 65 && k <= 90) return String.fromCodePoint(U + k - 65);
    if (k >= 97 && k <= 122) return String.fromCodePoint(L + k - 97);
    if (D && k >= 48 && k <= 57) return String.fromCodePoint(D + k - 48);
    return c;
  }).join("");
const table = (to: string, digits: string) => (t: string) => {
  const a = [...to], d = [...digits];
  return [...t.toLowerCase()].map((c) => {
    const k = c.charCodeAt(0);
    if (k >= 97 && k <= 122) return a[k - 97];
    if (k >= 48 && k <= 57) return d[k - 48];
    return c;
  }).join("");
};
const mark = (m: string) => (t: string) => [...t].map((c) => (c === " " ? c : c + m)).join("");
const wrap = (a: string, b: string) => (t: string) => `${a}${t}${b}`;
const ex = (s: string) => Object.fromEntries([...s].reduce<string[][]>((r, c, i) => (i % 2 ? (r[r.length - 1].push(c), r) : (r.push([c]), r)), []).map((p) => [p[0], p[1]]));
const script = ex("BℬEℰFℱHℋIℐLℒMℳRℛeℯgℊoℴ"), fraktur = ex("CℭHℌIℑRℜZℨ"), dbl = ex("CℂHℍNℕPℙQℚRℝZℤ");
const gm = [..."̖̗̘̙̜̝̞̟̠̤̥̦̩̪̫̬̭̮̯̰̱̲̳̹̺̻̼̍̎̄̅̿̑̆̐͒͗͑̇̈̊͂̓̈́͊͋͌̃̂̌͐̀́̋̏̒̓̔̽̉̾͛͆"];
const glitch = (t: string) => [...t].map((c, i) => c === " " ? c : c + [0, 1, 2].map((j) => gm[(i * (3 + 2 * j) + j * 7) % gm.length]).join("")).join("");
const bubbleDigits = ex("0⓪1①2②3③4④5⑤6⑥7⑦8⑧9⑨");
const full = (t: string) => [...t].map((c) => { const k = c.charCodeAt(0); return c === " " ? "\u3000" : k > 32 && k < 127 ? String.fromCharCode(k + 0xfee0) : c; }).join("");
const sym = (s: string) => () => s;

export const STYLES: Style[] = [
  { id: "double", name: "Double-Struck", cat: "fancy", fn: alpha(0x1d538, 0x1d552, 0x1d7d8, dbl) },
  { id: "sans", name: "Sans-Serif", cat: "fancy", fn: alpha(0x1d5a0, 0x1d5ba, 0x1d7e2) },
  { id: "script", name: "Script", cat: "cursive", fn: alpha(0x1d49c, 0x1d4b6, undefined, script) },
  { id: "bscript", name: "Bold Script", cat: "cursive", fn: alpha(0x1d4d0, 0x1d4ea) },
  { id: "bold", name: "Bold Serif", cat: "bold", fn: alpha(0x1d400, 0x1d41a, 0x1d7ce) },
  { id: "sbold", name: "Bold Sans", cat: "bold", fn: alpha(0x1d5d4, 0x1d5ee, 0x1d7ec) },
  { id: "italic", name: "Italic Serif", cat: "italic", fn: alpha(0x1d434, 0x1d44e, undefined, { h: "ℎ" }) },
  { id: "bitalic", name: "Bold Italic", cat: "italic", fn: alpha(0x1d468, 0x1d482) },
  { id: "fraktur", name: "Fraktur", cat: "gothic", fn: alpha(0x1d504, 0x1d51e, undefined, fraktur) },
  { id: "bfraktur", name: "Bold Fraktur", cat: "gothic", fn: alpha(0x1d56c, 0x1d586) },
  { id: "smallcaps", name: "Small Caps", cat: "small", fn: table("ᴀʙᴄᴅᴇꜰɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ", "0123456789") },
  { id: "bubble", name: "Bubbles", cat: "bubble", fn: alpha(0x24b6, 0x24d0, undefined, bubbleDigits) },
  { id: "mono", name: "Monospace", cat: "mono", fn: alpha(0x1d670, 0x1d68a, 0x1d7f6) },
  { id: "full", name: "Fullwidth", cat: "mono", fn: full },
  { id: "super", name: "Superscript", cat: "super", fn: table("ᵃᵇᶜᵈᵉᶠᵍʰⁱʲᵏˡᵐⁿᵒᵖqʳˢᵗᵘᵛʷˣʸᶻ", "⁰¹²³⁴⁵⁶⁷⁸⁹") },
  { id: "sub", name: "Subscript", cat: "sub", fn: table("ₐbcdₑfgₕᵢⱼₖₗₘₙₒₚqᵣₛₜᵤᵥwₓyz", "₀₁₂₃₄₅₆₇₈₉") },
  { id: "glitch", name: "Glitch", cat: "glitch", fn: glitch },
  { id: "strike", name: "Strikethrough", cat: "decorative", fn: mark("\u0336") },
  { id: "under", name: "Underline", cat: "decorative", fn: mark("\u0332") },
  { id: "sparkle", name: "Sparkles", cat: "decorative", fn: wrap("✦ ", " ✦") },
  { id: "bracket", name: "Brackets", cat: "decorative", fn: wrap("【", "】") },
  { id: "stars", name: "Stars", cat: "symbols", fn: sym("★ ☆ ✦ ✧ ✪ ✯ ❂") },
  { id: "hearts", name: "Hearts", cat: "symbols", fn: sym("♥ ♡ ❤ ❣ ❥ ❦ ❧") },
  { id: "arrows", name: "Arrows", cat: "symbols", fn: sym("→ ← ↑ ↓ ⇒ ⇐ ➜ ➤ ↝") },
  { id: "marks", name: "Marks", cat: "symbols", fn: sym("✓ ✔ ✗ ✘ © ® ™ § ¶ ∞") },
  { id: "flourish", name: "Flourish", cat: "art", fn: wrap("꧁ ", " ꧂") },
  { id: "kaomoji", name: "Kaomoji", cat: "art", fn: wrap("(っ◔◡◔)っ ♥ ", " ♥") },
  { id: "box", name: "Box Frame", cat: "art", fn: (t) => `╔${"═".repeat(t.length + 2)}╗\n║ ${t} ║\n╚${"═".repeat(t.length + 2)}╝` },
  { id: "divider", name: "Divider", cat: "art", fn: (t) => `──── ⋆⋅☆⋅⋆ ────\n${t}\n──── ⋆⋅☆⋅⋆ ────` },
];
export const POPULAR = ["bscript", "bold", "bubble", "fraktur", "smallcaps", "glitch"];
export const PRESETS = [
  { label: "Elegant bio", text: "Slow mornings & good coffee", cat: "cursive" },
  { label: "Bold headline", text: "Launch day", cat: "bold" },
  { label: "Gamer tag", text: "NightOwl", cat: "gothic" },
  { label: "Playful note", text: "Hello friend", cat: "bubble" },
];
