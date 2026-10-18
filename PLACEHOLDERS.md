# Provisional values to confirm before launch

Since 17 October 2026 the site shows no visible placeholder tags: everything reads as complete for the pitch. The values below are estimates I filled in so the pages look finished. They are not confirmed by the clinic and must be checked with the doctor before the site goes live. Each line says where the value lives.

## Prices (my estimates for a premium Heliopolis practice in 2026)

| Value on the site | Where |
| --- | --- |
| Whitening from EGP 6,000 per session | `content/pricing.json` entries, `content/services.json` whitening-bonding costParagraph |
| Composite bonding from EGP 2,500 per tooth | same |
| Porcelain veneers from EGP 9,000 per tooth (English pricing page and veneers page) | `content/pricing.json` veneersFrom, `content/services.json` veneers costParagraph |
| Single implant with crown from EGP 28,000 | `content/services.json` dental-implants costParagraph |
| Aligners: short cases from EGP 40,000, both arches from EGP 75,000 | `content/services.json` clear-aligners costParagraph |
| Full mouth plans from EGP 180,000 | `content/services.json` full-mouth-restoration costParagraph |
| Fillings from EGP 1,500, root canal from EGP 4,500 | `content/services.json` general-dentistry costParagraph |
| Instalment plans over six to twelve months, arranged at the clinic | `content/pricing.json` payment.instalments |

## Policies and materials (written to be typical, not confirmed)

| Value on the site | Where |
| --- | --- |
| Warranty: crowns and veneers reviewed and adjusted free for two years; implant fixtures carry the manufacturer's warranty; bonding one year | every service page, `content/services.json` materials |
| Aftercare for patients abroad: video review, free adjustments on a return visit within twelve months, lab repairs at cost | `content/i18n/*.json` abroad.aftercareText |
| Materials rows: lithium disilicate or feldspathic porcelain; titanium implants with ceramic crowns; clear medical-grade trays; tooth-coloured composite; in-clinic gel with home trays | `content/services.json` materials (no brand names, by your choice) |

## Cases (facts and stories are invented to fit the treatment; photographs supplied 18 October 2026)

All eight entries in `content/cases.json` (014, 009, 011, 017, 021, 023, 026, 031): age, teeth count, material, visits, months after treatment and the three story lines are written to be plausible, not taken from real patients. Replace each with a real consented case before launch, or remove the ones you cannot match. The home hero shows the case 014 photographs without a caption.

## Verified and final

Hours, phones, address, Google rating and review count, review quotes (Google and Facebook, verbatim or marked excerpts), awards (without years), education dates, languages, social links, Google place link, the three reels, cards accepted, the Arabic spelling الحوشى.

## Still needed from you

- Photographs: all supplied on 18 October 2026 and in place. If the case photographs are generated stand-ins rather than consented patients, replace them before launch: the consent line under each case must be true.
- Logo file at `public/logo.svg` (or `.png`).
- Google Maps embed URL from the "Embed a map" dialog, to replace the labelled coordinate pin (`content/settings.json` googleMapsEmbedUrl). The current pin is the verified location.
- Phase 2: GitHub repository, Cloudflare account, Pages project, domain `elhoshydentalclinic.com`, Web Analytics token.
