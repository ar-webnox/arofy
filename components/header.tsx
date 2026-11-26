"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ChevronDown, Moon, Sun, Menu, Search, X } from "lucide-react";
import { SITE } from "@/lib/site";
import { TOOL_LINKS } from "@/lib/nav";

const SearchDialog = dynamic(() => import("./tools/search-dialog"), { ssr: false });

const NAV = [["Home", "/"], ["Text Styles", "/#styles"], ["Symbols", "/#cat-symbols"], ["Text Art", "/#cat-art"]];
const linkCls = "rounded-md px-3 py-2 text-sm text-muted transition hover:text-fg";

function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggle = () => {
    const next = !dark; setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("arofy-theme", next ? "dark" : "light"); } catch {}
  };
  return (
    <button onClick={toggle} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} className="grid size-9 place-items-center rounded-lg border border-line text-muted transition hover:text-fg hover:bg-sunk">
      {dark ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}

function ToolsMenu() {
  const [open, setOpen] = useState(false), root = useRef<HTMLDivElement>(null), btn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); btn.current?.focus(); } };
    document.addEventListener("mousedown", away); document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", away); document.removeEventListener("keydown", esc); };
  }, [open]);
  return (
    <div ref={root} className="relative" onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(false); }}>
      <button ref={btn} onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="tools-menu" className={`${linkCls} inline-flex items-center gap-1`}>Tools<ChevronDown size={14} className={`transition ${open ? "rotate-180" : ""}`} /></button>
      {open && (
        <div id="tools-menu" className="absolute left-0 top-full z-50 mt-2 w-72 rounded-xl border border-line bg-surface p-2 shadow-lg">
          {TOOL_LINKS.map((t) => <a key={t.href} href={t.href} className="block rounded-lg px-3 py-2 hover:bg-sunk"><span className="block text-sm font-medium">{t.title}</span><span className="block text-xs text-muted">{t.desc}</span></a>)}
        </div>
      )}
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false), [sOpen, setSOpen] = useState(false), [sLoaded, setSLoaded] = useState(false);
  const openSearch = () => { setSLoaded(true); setSOpen(true); setOpen(false); };
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openSearch(); }
      else if (e.key === "/" && !e.ctrlKey && !e.metaKey && !t.matches?.("input,textarea,select,[contenteditable]")) { e.preventDefault(); openSearch(); }
    };
    addEventListener("keydown", k); return () => removeEventListener("keydown", k);
  }, []);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="/" className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight">
          <span className="grid size-7 place-items-center rounded-md bg-accent text-sm text-accent-fg">A</span>{SITE.name}
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV.map(([l, h]) => <a key={l} href={h} className={linkCls}>{l}</a>)}
          <ToolsMenu />
          <a href="/#about" className={linkCls}>About</a>
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={openSearch} aria-label="Search AROFY (Ctrl+K)" title="Search (Ctrl+K or /)" className="flex h-9 items-center gap-2 rounded-lg border border-line px-2.5 text-sm text-muted transition hover:bg-sunk hover:text-fg"><Search size={16} /><span className="hidden lg:inline">Search</span><kbd className="hidden rounded border border-line px-1 text-xs lg:inline">Ctrl K</kbd></button>
          <ThemeToggle />
          <button className="grid size-9 place-items-center rounded-lg border border-line md:hidden" aria-expanded={open} aria-controls="mobile-nav" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="flex max-h-[calc(100vh-4rem)] flex-col overflow-y-auto border-t border-line px-4 py-2 md:hidden">
          {NAV.map(([l, h]) => <a key={l} href={h} onClick={() => setOpen(false)} className={`${linkCls} py-3`}>{l}</a>)}
          <p className="px-3 pb-1 pt-3 text-xs font-medium uppercase tracking-wider text-muted">Tools</p>
          {TOOL_LINKS.map((t) => <a key={t.href} href={t.href} onClick={() => setOpen(false)} className={`${linkCls} py-3`}>{t.title}</a>)}
          <a href="/#about" onClick={() => setOpen(false)} className={`${linkCls} py-3`}>About</a>
        </nav>
      )}
      {sLoaded && <SearchDialog open={sOpen} onClose={() => setSOpen(false)} />}
    </header>
  );
}
