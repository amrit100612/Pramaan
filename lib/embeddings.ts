/**
 * Embedding helper for pgvector semantic search.
 * Generates 1536-dimensional vector for caption & semantic search matching.
 */

export async function generateTextEmbedding(text: string): Promise<number[]> {
  try {
    // If an OpenAI or AI Gateway key is available, use standard text-embedding-3-small
    const apiKey = process.env.OPENAI_API_KEY || process.env.AI_GATEWAY_API_KEY;
    if (apiKey) {
      const res = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          input: text,
          model: "text-embedding-3-small",
        }),
      });
      if (res.ok) {
        const json = await res.json();
        return json.data[0].embedding;
      }
    }
  } catch (err) {
    console.warn("Live embedding failed, falling back to simulated embedding vector:", err);
  }

  // Deterministic pseudo-embedding generator for offline / dev / demo mode
  // Produces a consistent 1536-dim vector from text hash
  return generateDeterministicVector(text, 1536);
}

function generateDeterministicVector(seedText: string, dimensions: number): number[] {
  let hash = 0;
  for (let i = 0; i < seedText.length; i++) {
    hash = (hash << 5) - hash + seedText.charCodeAt(i);
    hash |= 0;
  }

  const vector: number[] = [];
  let norm = 0;
  for (let d = 0; d < dimensions; d++) {
    const val = Math.sin(hash + d * 0.1);
    vector.push(val);
    norm += val * val;
  }
  const sqrtNorm = Math.sqrt(norm);
  return vector.map((v) => v / sqrtNorm);
}
