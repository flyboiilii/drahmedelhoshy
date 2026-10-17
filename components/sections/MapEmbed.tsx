import { settings } from "@/lib/content";

/** Google Maps iframe. The src is a placeholder built from the verified coordinates. */
export function MapEmbed({ title, className = "" }: { title: string; className?: string }) {
  return (
    <div className={`img-frame aspect-[4/3] ${className}`}>
      <iframe
        title={title}
        src={settings.googleMapsEmbedUrl}
        width="100%"
        height="100%"
        style={{ border: 0, display: "block" }}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
