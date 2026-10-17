"use client";

import { useState } from "react";
import { ReviewCard, type ReviewCardData } from "./ReviewCard";

type Item = ReviewCardData & { treatmentSlug: string };

type Props = {
  items: Item[];
  filters: { key: string; label: string }[];
  labels: { all: string; filter: string; paraphrased: string; source: string };
};

export function ReviewsGrid({ items, filters, labels }: Props) {
  const [active, setActive] = useState("all");
  const visible = active === "all" ? items : items.filter((i) => i.treatmentSlug === active);
  return (
    <div>
      <div role="group" aria-label={labels.filter} className="flex flex-wrap gap-2">
        <button type="button" className="pill" aria-pressed={active === "all"} onClick={() => setActive("all")}>
          {labels.all}
        </button>
        {filters.map((f) => (
          <button key={f.key} type="button" className="pill" aria-pressed={active === f.key} onClick={() => setActive(f.key)}>
            {f.label}
          </button>
        ))}
      </div>
      <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((r) => (
          <li key={r.id}>
            <ReviewCard data={r} labels={labels} />
          </li>
        ))}
      </ul>
    </div>
  );
}
