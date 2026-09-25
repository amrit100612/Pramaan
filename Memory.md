# Pramaan — Project Memory & Session State

## Current Status: Full Project Scaffold Completed

### 1. What's Built
- **Project Foundation:** Next.js (App Router) + TypeScript (`strict: true`) + Tailwind CSS + shadcn/ui.
- **Design System:** Complete implementation of `Design.md`:
  - Tokens: `ink` (`#1F2A24`), `paper` (`#EDE6D6`), `paper-light` (`#F6F2EA`), `moss` (`#3F6B4F`), `ochre` (`#C68A2E`), `oxide` (`#9E3B34`), `slate` (`#6B7268`).
  - Typography: Google Fonts loaded (`Fraunces` display, `IBM Plex Sans` body, `IBM Plex Mono` data).
  - Components: `Stamp.tsx` (ink stamp with `stamp-animate`), `ClaimCard.tsx` (voucher with perforated edge & atomic checks), `NavBar.tsx`.
- **Database Schema:** `supabase/migrations/20260925000000_init.sql` covering all 8 entities (`projects`, `assets`, `asset_pairs`, `trust_records`, `claims`, `verdicts`, `ledger_entries`, `reports`) with pgvector and Row Level Security.
- **Core Library (`lib/`):**
  - `lib/db.ts`: Public vs. Admin server-only Supabase client.
  - `lib/cloudinary.ts`: Signed upload payload generator, notification signature verification, related assets linker.
  - `lib/trust.ts`: Deterministic checks (geofence distance via Haversine, timestamp bounds, pHash Hamming distance duplicate check), compact Evidence State builder.
  - `lib/jev.ts`: Jev Jury evaluate wrapper, typed question probabilities, deterministic verdict math, in-memory caching by `(claim_hash, state_hash)`.
  - `lib/change-score.ts`: Sharp-based Excess Green index (`2*G - R - B`) calculation and delta scoring.
  - `lib/embeddings.ts`: Vector embedding generator for pgvector semantic search.
- **API Routes (`app/api/`):**
  - `POST /api/upload-signature`: Scoped signed upload parameters.
  - `POST /api/webhooks/cloudinary`: Raw body notification signature verification (401 on failure).
  - `POST /api/enrich`: Trust evaluation + embedding vector.
  - `POST /api/pair`: Before/after candidate generation by geo-radius.
  - `POST /api/claims/compile`: Draft line into atomic typed claims with Zod.
  - `POST /api/claims/verify`: Jev Jury execution with decision ledger entries.
  - `POST /api/report`: SDG-mapped report generation.
- **Application Pages:**
  - `app/(marketing)/page.tsx`: Public product landing page adhering to `Design.md`.
  - `app/(marketing)/terms/page.tsx` & `privacy/page.tsx`: Draft prototype notices.
  - `app/(dashboard)/projects/[id]/page.tsx`: Contact-sheet field ledger gallery.
  - `app/(dashboard)/search/page.tsx`: Natural-language semantic search.
  - `app/(dashboard)/before-after/[pairId]/page.tsx`: Before/after slider + ExG vegetation change scoring.
  - `app/(dashboard)/copilot/page.tsx`: Cited Copilot restricted to verified claims.
  - `app/(dashboard)/campaign/[claimId]/page.tsx`: Social-ready asset generator with verified QR overlay.
  - `app/verify/[assetId]/page.tsx`: Public QR-target verification receipt with 5-stage sequential transformation chain.

### 2. Next Tasks
1. Connect live Cloudinary credentials in `.env.local` to test live direct upload widget.
2. Connect live Supabase project and run `supabase/migrations/20260925000000_init.sql`.
3. Perform test call to Vercel AI Gateway / Jev slug to confirm production model identifier.
4. Ingest real field dataset (Sundarbans or Western Ghats site captures).
