import { FAQ, SITE } from "@/lib/site";

const STEPS = [["Type your text", "Enter a word, a bio or a whole caption in the workspace."], ["Pick a style", "Browse fifteen categories and watch every style update live."], ["Copy and paste", "One click copies real Unicode text that works in most apps."]];

export function HowItWorks() {
  return (
    <section aria-labelledby="how-h" className="border-y border-line bg-sunk/50 py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 id="how-h" className="font-display text-3xl font-semibold tracking-tight">How it works</h2>
        <ol className="mt-8 grid gap-4 md:grid-cols-3">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="rounded-xl border border-line bg-surface p-6">
              <span className="font-display text-3xl text-accent">0{i + 1}</span>
              <h3 className="mt-3 text-lg font-semibold">{t}</h3><p className="mt-1 text-muted">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function About() {
  return (
    <section id="about" aria-labelledby="about-h" className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h2 id="about-h" className="font-display text-3xl font-semibold tracking-tight">About the {SITE.name} font generator</h2>
      <div className="mt-4 space-y-4 text-muted leading-relaxed">
        <p>A fancy text generator replaces ordinary letters with look-alike characters from the Unicode standard. Because the result is plain text, it can be pasted into Instagram bios, Discord names, X posts, messages and documents without installing a font.</p>
        <p>{SITE.name} groups styles into cursive, bold, italic, gothic, bubble, monospace, small text, superscript, subscript, glitch, decorative, symbols and text art, so you can find the right tone quickly.</p>
        <h3 className="pt-2 text-lg font-semibold text-fg">Tips for good-looking results</h3>
        <p>Keep styled text short, pair it with plain text for readability and preview it on the platform you are posting to.</p>
      </div>
    </section>
  );
}

export function Faq() {
  return (
    <section aria-labelledby="faq-h" className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
      <h2 id="faq-h" className="font-display text-3xl font-semibold tracking-tight">Frequently asked questions</h2>
      <div className="mt-6 divide-y divide-line rounded-xl border border-line bg-surface">
        {FAQ.map(([q, a]) => (
          <details key={q} className="group p-5">
            <summary className="flex cursor-pointer list-none items-center justify-between font-medium">{q}<span aria-hidden className="text-muted transition group-open:rotate-45">+</span></summary>
            <p className="mt-3 text-muted">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-10 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div><p className="font-display text-lg font-semibold text-fg">{SITE.name}</p><p>{SITE.tagline}</p></div>
        <nav aria-label="Footer" className="flex gap-5"><a href="#styles" className="hover:text-fg">Text Styles</a><a href="#about" className="hover:text-fg">About</a><a href="#top" className="hover:text-fg">Back to top</a></nav>
        <p>© {new Date().getFullYear()} {SITE.name}</p>
      </div>
    </footer>
  );
}
