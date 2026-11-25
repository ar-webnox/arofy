"use client";
import { useEffect, useState } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { SITE } from "@/lib/site";

const NAV = [["Home", "#top"], ["Text Styles", "#styles"], ["Symbols", "#cat-symbols"], ["Text Art", "#cat-art"], ["About", "#about"]];

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

export function Header() {
  const [open, setOpen] = useState(false);
  const link = "rounded-md px-3 py-2 text-sm text-muted transition hover:text-fg";
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a href="#top" className="flex items-center gap-2 font-display text-xl font-semibold tracking-tight">
          <span className="grid size-7 place-items-center rounded-md bg-accent text-sm text-accent-fg">A</span>{SITE.name}
        </a>
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV.map(([l, h]) => <a key={l} href={h} className={link}>{l}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button className="grid size-9 place-items-center rounded-lg border border-line md:hidden" aria-expanded={open} aria-controls="mobile-nav" aria-label="Toggle menu" onClick={() => setOpen(!open)}>
            {open ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="flex flex-col border-t border-line px-4 py-2 md:hidden">
          {NAV.map(([l, h]) => <a key={l} href={h} onClick={() => setOpen(false)} className={`${link} py-3`}>{l}</a>)}
        </nav>
      )}
    </header>
  );
}
