"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";

type Props = {
  id: string;
  url: string;
  poster: string;
  title: string;
  playLabel: string;
  openLabel: string;
};

/**
 * Instagram reel slot. Shows the still until tapped, then loads Instagram's
 * own embed page in an iframe, so no third-party script runs before that.
 */
export function InstagramReel({ id, url, poster, title, playLabel, openLabel }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <figure>
      <div className="relative aspect-[9/16] img-frame bg-graphite">
        {open ? (
          <iframe
            src={`https://www.instagram.com/reel/${id}/embed/`}
            title={playLabel}
            className="absolute inset-0 h-full w-full"
            style={{ border: 0 }}
            loading="lazy"
            allow="encrypted-media; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button type="button" className="absolute inset-0 h-full w-full group" onClick={() => setOpen(true)} aria-label={`${playLabel}: ${title}`}>
            <Image src={poster} alt="" fill sizes="(min-width: 768px) 30vw, 100vw" className="object-cover opacity-90 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="h-14 w-14 rounded-full bg-alabaster text-graphite grid place-items-center shadow-[0_2px_14px_rgba(31,28,26,0.25)] transition-transform duration-500 ease-stone group-hover:scale-[1.02]">
                <Icon name="play" size={22} fill="currentColor" stroke="none" />
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="mt-3">
        <span className="block font-display text-lg leading-tight text-graphite">{title}</span>
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-link text-sm inline-flex items-center gap-1 mt-1">
          {openLabel} <Icon name="arrow-up-right" size={14} />
        </a>
      </figcaption>
    </figure>
  );
}
