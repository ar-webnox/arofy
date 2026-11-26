import { TOOL_LINKS } from "@/lib/nav";
export function ToolsGrid() {
  return (
    <section aria-labelledby="tg-h" className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <h2 id="tg-h" className="font-display text-3xl font-semibold tracking-tight">More tools for your text</h2>
      <p className="mt-2 text-muted">Everything runs in your browser. No sign-up, no uploads.</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TOOL_LINKS.map((t) => (
          <li key={t.href}><a href={t.href} className="block h-full rounded-xl border border-line bg-surface p-5 transition hover:border-accent/50 hover:shadow-sm"><span className="font-semibold">{t.title}</span><span className="mt-1 block text-sm text-muted">{t.desc}</span></a></li>
        ))}
      </ul>
    </section>
  );
}
