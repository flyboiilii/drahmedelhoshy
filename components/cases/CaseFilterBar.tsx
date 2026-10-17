"use client";

import { useState } from "react";

export type CaseFilterOption = { key: string; label: string };

type Props = {
  targetId: string;
  filters: CaseFilterOption[];
  labels: { all: string; filterLabel: string };
};

/** Filter pills. Writes data-filter on the grid root; CSS does the hiding. */
export function CaseFilterBar({ targetId, filters, labels }: Props) {
  const [active, setActive] = useState("all");
  const choose = (key: string) => {
    setActive(key);
    const root = document.getElementById(targetId);
    if (root) root.dataset.filter = key;
  };
  return (
    <div role="group" aria-label={labels.filterLabel} className="flex flex-wrap gap-2">
      <button type="button" className="pill" aria-pressed={active === "all"} onClick={() => choose("all")}>
        {labels.all}
      </button>
      {filters.map((f) => (
        <button key={f.key} type="button" className="pill" aria-pressed={active === f.key} onClick={() => choose(f.key)}>
          {f.label}
        </button>
      ))}
    </div>
  );
}
