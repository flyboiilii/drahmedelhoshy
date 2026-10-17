type Item = { year: string; text: string };

export function Timeline({ items }: { items: Item[] }) {
  return (
    <ol className="hairline">
      {items.map((it) => (
        <li key={`${it.year}-${it.text}`} className="grid grid-cols-[8rem_1fr] md:grid-cols-[12rem_1fr] gap-4 py-5 border-b border-line">
          <span className="font-display text-xl text-bronze-deep">{it.year}</span>
          <span className="text-graphite">{it.text}</span>
        </li>
      ))}
    </ol>
  );
}
