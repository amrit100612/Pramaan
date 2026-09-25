# Pramaan — Rules for AI-assisted coding

## Use
- TypeScript everywhere, `strict: true`. No `any` without a `// TODO(reason)` comment.
- Validate every external input (webhook body, form data, Jev response) with `zod` before touching it.
- Cloudinary Node SDK for all Cloudinary calls — no hand-rolled signing.
- Keep verdict math (thresholds, weighting, escalation rules) in plain TypeScript functions, never inside an LLM prompt. Jev/LLM outputs are *inputs* to that math, not the decision itself.
- Server-only secrets (`CLOUDINARY_API_SECRET`, `AI_GATEWAY_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) are only read in `app/api/**` or `lib/**` server code — never in a client component, never in a `NEXT_PUBLIC_*` variable.

## Avoid
- Don't add a new state-management library (Redux/Zustand/etc.) — React state plus server components is enough at this scale.
- Don't call the Cloudinary Admin API from the client. All Admin API calls go through our own API routes.
- Don't hand-roll session/JWT logic — use Supabase Auth as-is.
- Don't introduce a second vector store (Pinecone/Weaviate/etc.) — pgvector is already inside Postgres; one less service to keep alive during a demo.

## Error handling
- **Fail closed on trust, not on features.** If Cloudinary enrichment fails, still show the asset — just without tags/trust badge, marked "processing." If Jev or the escalation LLM errors, the claim's status is `needs_review`, never silently `verified`.
- Every API route returns `{ ok: boolean, error?: string }` on failure paths — no bare 500s with stack traces reaching the client.
- Webhook route: verify signature and timestamp *before* touching the body; on failure return 401, not 200 (a fake 200 would stop Cloudinary's retries from ever reaching a fixed endpoint).
- Log every verdict's inputs/outputs (state hash, question, probability) even on the happy path — this is the Decision Ledger, not optional debug output.

## Working with Jev specifically
- One compact state object per call — a few hundred tokens at most, built in `lib/trust.ts`. Never send raw EXIF blobs or full asset records.
- Never let Jev's probability alone flip a claim to "Verified" — always route it through the weighting/threshold function in `lib/jev.ts`.
- Cache verdicts by `(claim_hash, evidence_state_hash)` — don't re-call Jev for an unchanged claim.

## Working on existing code
- Inspect the current implementation before changing it — read the relevant file(s) first, don't guess at what's already there.
- Preserve working features; use the simplest implementation that satisfies the brief, not the most impressive one.
- Report exactly what was tested (which viewport widths, which flow) and what remains unfinished. Never describe a page or flow as checked if it wasn't actually run.

## Ask before doing
- Adding any npm dependency not already listed in `Architecture.md`'s stack table.
- Changing the verdict math's thresholds (these should come from the labeled-set evaluation in `PRD.md` §6, not a guess).
- Removing or weakening a Trust Layer check, even "temporarily for the demo."

## Git
- Branch per phase: `phase-1-ingest`, `phase-2-search`, etc. — matches `Phases.md`.
- Commit messages: `phase:` prefix, imperative mood — e.g. `phase-3: add before/after geo-radius pairing`.
- `.env.local` is gitignored; commit `.env.example` with empty values instead.
