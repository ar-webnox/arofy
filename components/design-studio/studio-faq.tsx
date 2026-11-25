export function StudioFaq({ items }: { items: readonly (readonly [string, string])[] }) {
  return (
    <section aria-labelledby="sfaq-h" className="mx-auto max-w-3xl px-4 pb-20 sm:px-6">
      <h2 id="sfaq-h" className="font-display text-3xl font-semibold tracking-tight">Studio FAQ</h2>
      <div className="mt-6 divide-y divide-line rounded-xl border border-line bg-surface">
        {items.map(([q, a]) => (
          <details key={q} className="group p-5">
            <summary className="flex min-h-6 cursor-pointer list-none items-center justify-between font-medium">{q}<span aria-hidden className="text-muted transition group-open:rotate-45">+</span></summary>
            <p className="mt-3 text-muted">{a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
