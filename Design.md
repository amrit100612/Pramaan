# Pramaan — Design System

## Grounding
Pramaan is an evidence/verification tool for NGO program officers, field staff, and donors — not a consumer app. The visual language should read like a **field ledger crossed with an official verification stamp**: something that belongs in a dossier of evidence, not a marketing SaaS product. Every trust state (verified / needs review / contradicted) should look and feel like an ink stamp, because that's the mental model the whole product is built on.

## Color
| Token | Hex | Role |
|---|---|---|
| `ink` | `#1F2A24` | Primary text, dark surfaces — deep forestry-ink green-black, not flat black |
| `paper` | `#EDE6D6` | Base background — aged ledger paper |
| `moss` | `#3F6B4F` | Verified state, primary accent, headers |
| `ochre` | `#C68A2E` | Needs-review / flagged state — turmeric-stamp tone |
| `oxide` | `#9E3B34` | Contradicted / rejected state — old rubber-stamp red |
| `slate` | `#6B7268` | Borders, secondary text, dividers |

Deliberately not the warm-cream-plus-terracotta or near-black-plus-neon pairings that read as generated-by-default — this leans into paper/stamp/ledger material instead of a generic light or dark SaaS theme.

## Type
| Role | Face | Why |
|---|---|---|
| Display / headings | Fraunces (serif, soft optical sizing) | Slightly irregular at large sizes — reads as stamped/printed, not corporate |
| Body / UI | IBM Plex Sans | Technical-but-humanist register, fits a governmental/NGO evidence tool |
| Data / receipts / hashes | IBM Plex Mono | Asset IDs, hashes, timestamps only — never prose |

Two clearly distinct families (serif display, sans body) plus one monospace reserved strictly for data.

## Layout
Left-aligned, document-column layouts throughout — this is a dossier, not a centered landing page.

```
Gallery (contact-sheet, not card-grid):
┌───────────┬───────────┬───────────┐
│  photo    │  photo    │  photo    │
├───────────┼───────────┼───────────┤
│ Site A · 12 Aug · [●moss] 0.92    │  ← ledger line, not a caption chip
├───────────┼───────────┼───────────┤
│  photo    │  photo    │  photo    │
└───────────┴───────────┴───────────┘

Claim Card (stamped voucher, not a rounded SaaS card):
┌──────────────────────────────┐
╱                                ╲   ← torn/perforated top edge (SVG)
│  "Plantation drive, Site A"    │
│  ─────────────────────────    │
│  activity shown      ✓ 0.94   │
│  wrong environment    ✗ 0.03  │
│  scale contradicts    ✗ 0.06  │
│                         [MOSS │
│                        STAMP, │
│                       rotated │
│                         -6°]  │
│  a1b2…f9  ·  02:14:09         │  ← mono footer: state hash + time
└──────────────────────────────┘
```

## Principles
1. **Stamps, not badges.** Verified/Review/Rejected render as a rotated ink-stamp graphic (SVG, `moss`/`ochre`/`oxide`), not a rounded pill — this is the one bold element per screen.
2. **Numbering only where it's real.** The transformation chain on a Verify page is genuinely sequential, so it's the one place using numbered steps; nowhere else.
3. **One motion moment.** When a claim resolves, the stamp animates down once (scale + slight rotate, ~200ms) — no hover animation on every card, no page-load fade cascade.
4. **Density is a feature.** This is a professional evidence tool — ledger lines, mono data, and visible metadata are correct, not clutter to hide behind whitespace.
5. **Public pages stay legible without color.** The Verify page (judges/donors scanning a QR) must read in grayscale — stamps always carry a text label (`VERIFIED` / `REVIEW` / `CONTRADICTED`), never color alone.

## States
| State | Color | Label |
|---|---|---|
| Verified | `moss` | "VERIFIED" |
| Needs review | `ochre` | "REVIEW" |
| Contradicted | `oxide` | "CONTRADICTED" |
| Processing | `slate`, no stamp yet | "PROCESSING" |

---

## Public Marketing Site (separate from the dashboard above)

Everything above governs the operational tool — gallery, search, claim cards, verify page — that program officers and field staff use daily. The public marketing site does a different job: a small set of pages that explain Pramaan to someone seeing it for the first time (donors, partners, judges), in the restrained, product-first register of Apple's marketing pages rather than the ledger/stamp density of the app itself. Same brand, quieter register — not a second identity.

### Brief
| Field | Answer |
|---|---|
| Product | Pramaan — turns NGO and sustainability field photos/video into searchable, quantified evidence; every claim in a report is checked against the actual media before it's allowed to publish |
| Audience | NGO program officers and M&E leads, CSR/donor reviewers, and hackathon judges seeing it for the first time |
| Main action | Watch a real claim get verified, end to end — there's no signup flow at MVP stage, so the CTA is "see it work," not "create an account" |
| Real content needed | One real before/after pair, one real Claim Card with an actual Jev verdict, a 60–90s screen recording. **None of this exists yet** — capture it in Phase 0/1 before this page ships; don't fill the hero with a placeholder |
| Pages this version needs | One scrollable home page (hero, problem, how it works, live demo embed, hackathon footer) + Terms and Privacy stub pages |
| Existing stack | Same Next.js/TS/Tailwind repo as the dashboard — see the routing note in `Architecture.md` |
| Reference | None supplied — the brief's own "Apple marketing restraint" description is the reference |

### Design direction
Reuses two of the three dashboard tokens rather than inventing a second palette, so the brand reads as one thing at two volumes:
| Token | Hex | Role here |
|---|---|---|
| `ink` | `#1F2A24` | Text |
| `paper-light` | `#F6F2EA` | Background — warmer and lighter than the dashboard's `paper`, still not pure white |
| `moss` | `#3F6B4F` | The one restrained accent — reusing "verified green" as the public brand color is deliberate, not incidental |

Type stays identical to the dashboard system above — Fraunces for display, IBM Plex Sans for body, IBM Plex Mono for any data shown (a real verdict snippet, a hash). None of Inter, Geist, or Space Grotesk were ever in the system, so this constraint was already satisfied before it was asked for.

Icons: no Lucide. The brand's whole vocabulary is already the ink stamp — build the handful of icons this page actually needs (play, external link) as small custom SVG marks in the same line weight as the stamp graphic, rather than pulling in a second icon system.

### Layout — vary each section to what it explains
```
Hero        — headline, one-line description, CTA, real product screenshot
              (a Claim Card or the Verify page) as the dominant visual, left-aligned
Problem     — short paragraph, no stat cards (no real numbers exist yet)
How it      — three stages, three different treatments, not three matching cards:
 works        1. Perceive  — wide image+text row (an actual tagged asset)
              2. Verify    — a real (or clearly labeled simulated) Jev verdict,
                             shown as mono-font data, not an icon
              3. Publish   — a screenshot of a generated receipt/report
Demo        — the real screen recording, or a link to a live Verify page
Footer      — hackathon context, dates, GitHub/submission link, Terms/Privacy
```

### Content rules
- No invented testimonials, logos, customers, or stats — accurate anyway, since there are no users yet.
- No em dashes, en dashes, or an "it's not X, it's Y" copy formula — state the benefit directly.
- Any simulated result (a verdict shown before the real pipeline is wired up) is labeled "Simulated example" in the UI itself, not just known internally.

### Behavior
- One motion moment only, same principle as the dashboard — no per-card hover animation.
- Respect `prefers-reduced-motion`; normal scroll behavior throughout.
- Keyboard focus stays visible; there are no real forms on this page at MVP (no signup exists yet), so this mainly covers the nav and the demo player's controls.

### Terms and Privacy — draft status
Pramaan has no real legal or data-handling commitments yet — this is a hackathon prototype, not a live product with real accounts. Both pages should say so plainly and be marked **DRAFT — for review before any real user data is collected**, stating only what's actually true today (media stored via Cloudinary, metadata via Supabase, no account system yet) rather than inventing policy language.

### Build workflow for this page specifically
Inspect the existing repo and this design system before writing anything new; reuse the `ink`/`moss`/type tokens rather than re-deriving them. Build the hero section first with the real screenshot once it exists, check it at desktop and mobile widths, then extend to the rest of the page. Report what was actually tested (which widths, which browsers) and what's still unfinished — don't report a page as checked if it wasn't actually run.
