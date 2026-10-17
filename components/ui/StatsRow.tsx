type Stat = { value: string; label: string };

export function StatsRow({ stats, className = "" }: { stats: Stat[]; className?: string }) {
  return (
    <dl className={`grid grid-cols-3 gap-6 ${className}`}>
      {stats.map((s) => (
        <div key={s.label} className="flex flex-col border-s border-line ps-4">
          <dd className="font-display text-2xl md:text-3xl leading-none text-graphite order-1 mb-1">{s.value}</dd>
          <dt className="caption order-2">{s.label}</dt>
        </div>
      ))}
    </dl>
  );
}
