# Pramaan — Build Phases

Each phase should be independently demoable — if time runs out, stopping after any phase still leaves something coherent to show. Phases map to git branches (see `Rules.md`). Written as functional workstreams rather than named roles, so it scales whether it's one person or several.

## Phase 0 — Setup (25 Sep)
- Cloudinary: enable AI Vision/captioning add-on, confirm `visual_search` and `signature_algorithm` account settings.
- Supabase: enable `pgvector`, create base schema (`System-Design.md` §2).
- Vercel AI Gateway key; one test call to Jev to confirm the working model slug.
- Capture or source the demo dataset — 2–3 project sites × 6–10 before/after pairs + 2 short videos, real GPS/timestamps.
- **Demo checkpoint:** none yet — infra only.

## Phase 1 — Smart Ingest (26–27 Sep)
- Signed upload widget scoped to a project/activity.
- Webhook receiver with signature verification.
- Store EXIF/GPS/timestamp/quality/pHash per asset.
- **Demo checkpoint:** upload a photo, see it appear with its metadata.

## Phase 2 — AI Tagging + Semantic Search (27–28 Sep)
- Call Cloudinary AI Vision for captions/tags on webhook.
- Embed captions, store in pgvector.
- Search UI: natural-language query + project/geo/date filters.
- **Demo checkpoint:** type a query, get relevant matching assets back.

## Phase 3 — Before/After Studio (29 Sep)
- Candidate pairing: same-project assets within a GPS radius, ranked by embedding similarity.
- Slider UI; time-lapse stitch for 3+ shots of a site.
- Change Score v1 (ExG for vegetation cases).
- **Demo checkpoint:** pick a site, see a before/after slider and a change number.

## Phase 4 — Trust Layer + Jev Jury (29–30 Sep)
- Deterministic checks: geofence, timestamp sanity, blur, pHash duplicate/reuse detection.
- Evidence State builder (compact JSON per asset/claim).
- Claim compiler: split a draft line into atomic typed claims.
- Jev integration: boolean/score/choice questions, verdict math, escalation to the vision LLM on borderline.
- Decision ledger (state hash + question + probability, stored).
- **Demo checkpoint:** feed a true and a false claim, see different verdicts live.

## Phase 5 — Reports + Receipts + Verify page (30 Sep – 1 Oct)
- PDF report generator, SDG-mapped, one "receipt" section per asset.
- Public `/verify/:assetId` page (QR target): asset + trust badge + transformation chain.
- **Demo checkpoint:** generate a report, scan its QR, land on a matching verify page.

## Phase 6 — Cited Copilot (1 Oct)
- Chat UI restricted to verified claims only; "no evidence found" when nothing qualifies.
- Clickable citations linking back to receipts.
- **Demo checkpoint:** ask a question live, get a cited answer.

## Phase 7 — Campaign Studio (1–2 Oct)
- One-click generation: IG carousel, 9:16 story, LinkedIn banner, short reel.
- Cloudinary generative fill/background-replace + smart crop + verified-badge QR overlay + bilingual caption.
- **Demo checkpoint:** turn a verified claim into a postable asset.

## Phase 8 — Submission hardening (2 Oct)
- Deploy, record a 2-minute backup demo video, write the README.
- Run the labeled-set evaluation (40–60 claims) for real precision/recall numbers.
- Public landing page (`Design.md` → Public Marketing Site) if time allows — a good async-reviewable front door for judges, but never at the cost of the working demo itself. Slides to Phase 9 if it doesn't fit.
- Submit for the 3 Oct online round.

## Phase 9 — Offline-round stretch (4–10 Oct)
- Video Moments (keyframe extraction + timestamped search).
- Privacy Guard (auto face-blur on public/campaign assets).
- Field capture bot or offline-first PWA — pick one.
- Geo-timeline map.
- Evidence-ablation explanations for the Decision Ledger.
- Pitch rehearsal, including the live "upload a judge's photo twice" duplicate-detection moment.
