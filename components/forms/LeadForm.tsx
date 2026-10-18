"use client";

import { useId, useState } from "react";
import type { Dict, Lang } from "@/lib/i18n";
import { leadUrl } from "@/lib/lead";
import { track } from "@/lib/track";

type Option = { value: string; label: string };

type Props = {
  lang: Lang;
  page: string;
  t: Dict["form"];
  treatments: Option[];
  className?: string;
};

type Fields = { name: string; phone: string; treatment: string; visitType: "clinic" | "video"; day: string };

/** Two rules only, kept out of zod so the client bundle stays small. */
function validate(raw: Record<string, string>, t: Dict["form"]): { data?: Fields; errors: { name?: string; phone?: string } } {
  const errors: { name?: string; phone?: string } = {};
  const name = raw.name.trim();
  const phone = raw.phone.trim().replace(/[\s().-]/g, "");
  if (name.length < 2) errors.name = t.errorName;
  if (!/^\+?\d{8,15}$/.test(phone)) errors.phone = t.errorPhone;
  if (errors.name || errors.phone) return { errors };
  return {
    errors,
    data: {
      name,
      phone,
      treatment: raw.treatment,
      visitType: raw.visitType === "video" ? "video" : "clinic",
      day: raw.day,
    },
  };
}

/**
 * Composes a WhatsApp message from the fields and opens wa.me. No backend.
 * If NEXT_PUBLIC_WEB3FORMS_KEY is set at build time, a JSON copy is also
 * posted to Web3Forms so the clinic gets an email.
 */
export function LeadForm({ lang, page, t, treatments, className = "" }: Props) {
  const id = useId();
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const web3formsKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const raw = {
      name: String(fd.get("name") ?? ""),
      phone: String(fd.get("phone") ?? ""),
      treatment: String(fd.get("treatment") ?? "unsure"),
      visitType: String(fd.get("visitType") ?? "clinic"),
      day: String(fd.get("day") ?? "any"),
    };
    const { data, errors: errs } = validate(raw, t);
    setErrors(errs);
    if (!data) return;

    const treatmentLabel = treatments.find((o) => o.value === data.treatment)?.label ?? t.treatmentUnsure;
    const visitLabel = data.visitType === "video" ? t.video : t.inClinic;
    const dayLabel = data.day === "any" ? t.anyDay : data.day;
    const url = leadUrl(t, {
      name: data.name,
      phone: data.phone,
      treatment: treatmentLabel,
      visitType: visitLabel,
      day: dayLabel,
      page,
    });

    track("lead_submit", { treatment: data.treatment, visitType: data.visitType, lang });

    if (web3formsKey) {
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: web3formsKey,
          subject: `Website lead: ${treatmentLabel}`,
          from_name: "El Hoshy Dental website",
          name: data.name,
          whatsapp: data.phone,
          treatment: treatmentLabel,
          visit_type: visitLabel,
          preferred_day: dayLabel,
          language: lang,
          page,
        }),
      }).catch(() => {
        /* WhatsApp is the primary channel; email is best effort */
      });
    }

    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) window.location.href = url;
    setSentUrl(url);
    form.reset();
  };

  if (sentUrl) {
    return (
      <div className={`card p-7 md:p-9 ${className}`} id="lead-form" role="status" aria-live="polite">
        <p className="eyebrow mb-3">{t.title}</p>
        <p className="font-display text-2xl">{t.thanksTitle}</p>
        <p className="mt-3 text-muted">{t.thanksText}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={sentUrl} target="_blank" rel="noopener noreferrer" className="btn btn-dark" data-event="whatsapp">
            {t.openAgain}
          </a>
          <button type="button" className="btn btn-secondary" onClick={() => setSentUrl(null)}>
            {t.again}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form id="lead-form" className={`card p-6 md:p-9 ${className}`} onSubmit={onSubmit} noValidate data-testid="lead-form">
      <p className="font-display text-2xl mb-6">{t.title}</p>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor={`${id}-name`}>
            {t.name}
          </label>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="name"
            className="field"
            required
            aria-invalid={errors.name ? "true" : undefined}
            aria-describedby={errors.name ? `${id}-name-err` : undefined}
          />
          {errors.name && (
            <p id={`${id}-name-err`} className="mt-2 text-sm text-terracotta">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label className="label" htmlFor={`${id}-phone`}>
            {t.phone}
          </label>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            dir="ltr"
            placeholder="+20"
            className="field"
            required
            aria-invalid={errors.phone ? "true" : undefined}
            aria-describedby={`${id}-phone-hint${errors.phone ? ` ${id}-phone-err` : ""}`}
          />
          <p id={`${id}-phone-hint`} className="mt-2 caption">
            {t.phoneHint}
          </p>
          {errors.phone && (
            <p id={`${id}-phone-err`} className="mt-1 text-sm text-terracotta">
              {errors.phone}
            </p>
          )}
        </div>
        <div>
          <label className="label" htmlFor={`${id}-treatment`}>
            {t.treatment}
          </label>
          <select id={`${id}-treatment`} name="treatment" className="field" defaultValue="unsure">
            <option value="unsure">{t.treatmentUnsure}</option>
            {treatments.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor={`${id}-day`}>
            {t.day}
          </label>
          <select id={`${id}-day`} name="day" className="field" defaultValue="any">
            <option value="any">{t.anyDay}</option>
            {t.days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
      </div>

      <fieldset className="mt-5">
        <legend className="label">{t.visitType}</legend>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <label className="inline-flex items-center gap-2 text-graphite">
            <input type="radio" name="visitType" value="clinic" defaultChecked className="accent-graphite" />
            {t.inClinic}
          </label>
          <label className="inline-flex items-center gap-2 text-graphite">
            <input type="radio" name="visitType" value="video" className="accent-graphite" />
            {t.video}
          </label>
        </div>
      </fieldset>

      <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-4">
        <button type="submit" className="btn btn-primary" data-event="book">
          {t.submit}
        </button>
        <p className="caption max-w-sm">{t.note}</p>
      </div>
    </form>
  );
}
