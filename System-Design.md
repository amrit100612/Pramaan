# Pramaan — System Design (HLD)

## 1. Component overview
```mermaid
graph TB
  subgraph Client
    A[Next.js frontend]
  end
  subgraph Vercel
    B[Next.js API routes]
    G[Vercel AI Gateway - Jev + escalation LLM]
  end
  subgraph Cloudinary
    C1[Upload + storage]
    C2[AI Vision / captioning]
    C3[Generative transforms]
    C4[Related assets]
    C5[Webhooks]
  end
  subgraph Supabase
    D1[(Postgres)]
    D2[(pgvector)]
    D3[Auth]
  end
  A -->|signed upload| C1
  C5 -->|notification| B
  B --> C2
  B --> C4
  B --> G
  B --> D1
  B --> D2
  A -->|session| D3
  B --> C3
```

## 2. Data model (core entities)
```mermaid
erDiagram
  PROJECT ||--o{ ASSET : contains
  ASSET ||--o{ ASSET_PAIR : "before/after"
  ASSET ||--|| TRUST_RECORD : has
  ASSET }o--o{ CLAIM : "cited by"
  CLAIM ||--|| VERDICT : has
  VERDICT ||--o{ LEDGER_ENTRY : logs
  REPORT ||--o{ CLAIM : includes

  PROJECT {
    uuid id
    text name
    text sdg_tags
  }
  ASSET {
    uuid id
    text cloudinary_public_id
    text project_id
    jsonb exif
    geography location
    timestamptz captured_at
    text phash
    float quality_score
    vector embedding
  }
  ASSET_PAIR {
    uuid before_asset_id
    uuid after_asset_id
    float similarity
    float change_score
  }
  TRUST_RECORD {
    uuid asset_id
    bool geofence_ok
    bool timestamp_ok
    bool duplicate_flag
    float base_trust
  }
  CLAIM {
    uuid id
    text text
    uuid_array cited_asset_ids
  }
  VERDICT {
    uuid claim_id
    jsonb jev_answers
    float survival_score
    text status
  }
  LEDGER_ENTRY {
    uuid verdict_id
    text state_hash
    text question
    float probability
    timestamptz created_at
  }
```

## 3. Sequence: ingest → enrichment
```mermaid
sequenceDiagram
  participant F as Field user
  participant N as Next.js
  participant C as Cloudinary
  N->>C: signed upload params
  F->>C: direct upload (photo/video)
  C-->>N: webhook (upload), X-Cld-Signature + X-Cld-Timestamp
  N->>N: verify signature (SDK, raw body, freshness ~7200s)
  N->>C: fetch AI Vision tags/captions
  N->>N: embed caption, store asset row + pgvector
  N->>C: add_related_assets (link derived <-> original)
```
The webhook signature check must run before the body is parsed for anything else, and must hash the **raw** request bytes — Cloudinary's signature is `SHA(raw_body + timestamp + api_secret)`, a plain hash, not a keyed HMAC, so re-serializing the JSON before checking breaks verification. Retries arrive up to 3 times (roughly 3/6/9 minutes) if we don't return 200, so returning `401` on a bad signature is safe and expected — Cloudinary won't disable the endpoint for it.

## 4. Sequence: claim verification (Jev Jury)
```mermaid
sequenceDiagram
  participant U as Report/Campaign draft
  participant CC as Claim Compiler
  participant EB as Evidence State builder
  participant J as Jev (AI Gateway)
  participant V as Verdict math
  participant L as Vision LLM
  U->>CC: draft line
  CC->>EB: atomic claim + cited asset ids
  EB->>EB: pull trust record, captions, geo/time deltas (code, not LLM)
  EB->>J: compact state + typed questions (boolean/score/choice)
  J-->>V: probabilities per question
  V->>V: apply weights/thresholds (plain TS, not a prompt)
  alt confident
    V-->>U: Verified / Contradicted
  else borderline
    V->>L: escalate with actual image
    L-->>V: re-checked verdict
    V-->>U: final status
  end
  V->>V: write state hash + question + probability to Decision Ledger
```

## 5. API contract (summary)
| Endpoint | Method | Auth | Purpose |
|---|---|---|---|
| `/api/upload-signature` | POST | session | Scoped signed upload params |
| `/api/webhooks/cloudinary` | POST | signature header | Ingest notification |
| `/api/enrich` | POST | internal | Tagging + embedding |
| `/api/pair` | POST | session | Before/after candidate generation |
| `/api/claims/compile` | POST | session | Draft text → atomic claims |
| `/api/claims/verify` | POST | session | Runs Jev Jury, returns verdict |
| `/api/report` | POST | session | PDF generation |
| `/verify/:assetId` | GET | none | Public QR-target page |

## 6. Security & integrity
- **Originals stay `authenticated` delivery type**; only derived/public versions are `upload`/public — keeps a private master copy of every asset.
- **Webhook signature verification is mandatory**, not optional (see §3). Confirm `signature_algorithm` against the account — the SDK default is SHA-1, SHA-256 is opt-in.
- **Traceability is two-layered:** our own `LEDGER_ENTRY` rows, plus Cloudinary's own `add_related_assets` linking every derived/transformed asset back to its original (up to 10 related assets per call, bidirectional) — so the chain is verifiable inside Cloudinary's own library too, not only in our database.
- **Row Level Security** in Supabase: a field user can insert assets into their own project only; verdicts and ledger entries are insert-only from server routes, never client-writable.
- **Duplicate/reuse detection** via `phash` distance is a similarity signal, not proof — labeled that way in the UI (see `Design.md` states).

## 7. Scaling notes (stated honestly, for a hackathon-scale system)
- pgvector is fine up to tens of thousands of assets; at real production scale, embeddings would move to a dedicated vector store — out of scope here.
- Jev's per-question calls run in parallel already, so the number of questions per claim barely affects latency — the real cost lever is claim *volume*, controlled by the cascade (Jev on everything, the vision LLM only on the borderline slice).
- Video processing (keyframing, transcripts) is the one component worth queuing as a background job rather than running inline in a webhook handler, given typical serverless timeout limits.

## 8. Known limitations (say these on stage before a judge finds them)
- EXIF/GPS can be spoofed — the Trust Layer is described as tamper-evident, not tamper-proof.
- Jev's probabilities are only as calibrated as the labeled-set evaluation actually run in Phase 8 — quote that number, not a vendor benchmark.
- Cloudinary's premium Visual Search (Assets) feature requires Enterprise and per-asset opt-in at upload time — semantic search here is built on our own pgvector embeddings so it doesn't depend on that being enabled.
