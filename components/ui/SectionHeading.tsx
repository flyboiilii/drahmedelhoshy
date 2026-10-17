import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";

type Props = {
  eyebrow?: string;
  title: ReactNode;
  lead?: ReactNode;
  level?: "h1" | "h2";
  align?: "start" | "center";
  className?: string;
  id?: string;
};

export function SectionHeading({ eyebrow, title, lead, level = "h2", align = "start", className = "", id }: Props) {
  const Tag = level;
  return (
    <div className={`max-w-3xl ${align === "center" ? "mx-auto text-center" : ""} ${className}`}>
      {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
      <Tag id={id} className={level === "h1" ? "h1" : "h2"}>
        {title}
      </Tag>
      {lead && <p className="lead mt-5">{lead}</p>}
    </div>
  );
}
