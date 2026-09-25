# Pramaan — Product Requirements Document

**Event:** Geek Room × Cloudinary, Problem Statement 02 · Online round 3 Oct 2026 · Offline round 11 Oct 2026
**One-line:** Pramaan turns raw field photos/video from NGOs, governments and sustainability orgs into searchable, quantified, and cited evidence of impact.

## 1. Problem (in our words)
Field teams generate large volumes of photos and videos from projects, environmental work and community programs. Manually organizing, verifying, and turning that media into credible reports or "proof of impact" doesn't scale — and donors, the public, and journalists increasingly question whether impact claims are actually backed by evidence rather than reused or misleading photos.

## 2. Users & personas
- **M&E / Program officer** (primary) — compiles reports on a deadline, needs defensible evidence fast, not folders of photos.
- **Field staff / volunteer** — uploads media from a site visit with minimal training.
- **Donor / CSR reviewer / public** — scans a QR code on a report and wants to independently check a claim.
- **Hackathon judge** — a persona worth designing for: needs to grasp the differentiation in under 3 minutes.

## 3. Goals
1. Ingest large photo/video batches with rich, automatically captured context (project, location, time, quality).
2. Make media searchable in natural language, not folder browsing.
3. Quantify before/after change instead of asking people to "trust the caption."
4. Attach a verifiable trust signal to every *claim*, not just to every asset.
5. Generate reports and campaign content that only say what the evidence actually supports.
6. Preserve a traceable, tamper-evident chain from a claim back to its source asset.

## 4. Non-goals (v1)
- Not a satellite/remote-sensing platform.
- Not a legal or forensic authentication tool — "tamper-evident," never "unhackable proof."
- No outbreak/impact forecasting — verification of evidence only.

## 5. Feature list (tiered)

### Must — Tier 1, required by 3 Oct
| # | Feature | User story |
|---|---|---|
| 1 | Smart Ingest | Field officer uploads photos/videos tagged to a project/activity/location, so nothing gets lost in a folder |
| 2 | AI Tagging | Every asset is auto-tagged and captioned — no manual labelling |
| 3 | Semantic Search | "Plantation near a river after monsoon" returns matching media, not folders |
| 4 | Before/After Studio | Paired before/after shots of the same site show whether anything actually changed |
| 5 | Evidence Receipts + Report | A PDF where every claim links to an asset "receipt" with metadata |

### Should — Tier 2, target for 3 Oct, hardened through 11 Oct
| # | Feature | User story |
|---|---|---|
| 6 | Change Score | A number/heatmap for "how much changed," not just a slider |
| 7 | Trust Layer / Survival Score | Flags a reused, out-of-geofence, or otherwise suspicious photo before anyone believes it |
| 8 | Jev Jury (verdict engine) | Every claim is cross-examined against evidence before it enters a report |
| 9 | Cited Copilot | A question gets an answer with clickable evidence, or "no evidence found" |
| 10 | Campaign Studio | Social-ready assets generated from verified evidence in one click |

### Could — Tier 3, offline-round stretch, 4–10 Oct
| # | Feature |
|---|---|
| 11 | Video Moments — searchable video timestamps |
| 12 | Privacy Guard — auto face-blur on public assets |
| 13 | Field capture bot / offline-first PWA |
| 14 | Geo-timeline map |
| 15 | Decision ledger + evidence-ablation explanations |

## 6. Success metrics (for the demo)
- Upload → tagged → searchable in under a minute (excluding heavy video).
- Claim verification precision/recall measured on our own labeled set of 40–60 claims (half deliberately false) — a real number, not a vendor benchmark.
- Duplicate/reuse detection catches a re-uploaded judge photo live, on stage.
- A judge who scans a report's QR sees the same verdict Pramaan showed on screen.

## 7. Assumptions & open risks
- Cloudinary AI Vision/captioning add-ons need to be confirmed enabled on the hackathon account — verify Day 0.
- Jev (TypeSafe AI, via Vercel AI Gateway) pricing/availability may change after the 25 Sep promo window — keep an LLM-based fallback evaluator ready.
- Team size isn't fixed yet — `Phases.md` is written as functional workstreams so it scales from one person to several.

## 8. Milestones
| Date | Milestone |
|---|---|
| 25 Sep | Accounts + keys live, dataset capture starts |
| 28 Sep | Ingest → enrich → search working |
| 30 Sep | Trust Layer + Jev Jury + receipts working |
| 2 Oct | Campaign Studio + Copilot done, deployed, backup demo video recorded |
| 3 Oct | Online round submission |
| 10 Oct | Stretch features done, pitch rehearsed |
| 11 Oct | Offline round |
