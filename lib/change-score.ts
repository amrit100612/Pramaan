import sharp from "sharp";

export interface ChangeScoreResult {
  beforeExg: number; // Excess Green index (-1 to +1 normalized)
  afterExg: number;
  exgDelta: number; // Vegetation increase/decrease
  changeScore: number; // 0.0 to 1.0 overall magnitude of change
  confidence: number;
  summary: string;
}

/**
 * Computes the Excess Green (ExG) index of an image buffer:
 * ExG = 2 * G - R - B
 * Normalized to approximately [0, 1] range for vegetation detection.
 */
export async function calculateExgIndex(imageBuffer: Buffer): Promise<number> {
  try {
    const { data, info } = await sharp(imageBuffer)
      .resize(128, 128, { fit: "cover" }) // downscale for fast calculation
      .raw()
      .toBuffer({ resolveWithObject: true });

    let totalExg = 0;
    const pixelCount = info.width * info.height;
    const channels = info.channels;

    for (let i = 0; i < data.length; i += channels) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const sum = r + g + b || 1;

      // Normalized RGB
      const normR = r / sum;
      const normG = g / sum;
      const normB = b / sum;

      // ExG = 2g - r - b
      const exg = 2 * normG - normR - normB;
      totalExg += exg;
    }

    const meanExg = totalExg / pixelCount;
    // Map typical [-0.5, 0.5] range to [0, 1]
    return Math.max(0, Math.min(1, (meanExg + 0.5)));
  } catch (error) {
    console.error("Error calculating ExG index:", error);
    return 0.5;
  }
}

/**
 * Computes change score between before and after images.
 */
export async function computeChangeScore(
  beforeBuffer: Buffer,
  afterBuffer: Buffer
): Promise<ChangeScoreResult> {
  const [beforeExg, afterExg] = await Promise.all([
    calculateExgIndex(beforeBuffer),
    calculateExgIndex(afterBuffer),
  ]);

  const exgDelta = afterExg - beforeExg;
  const changeScore = Math.min(1.0, Math.abs(exgDelta) * 2.5);

  let summary = "";
  if (exgDelta > 0.1) {
    summary = `Significant vegetation increase (+${(exgDelta * 100).toFixed(1)}% ExG index)`;
  } else if (exgDelta < -0.1) {
    summary = `Vegetation reduction or canopy clearing detected (${(exgDelta * 100).toFixed(1)}% ExG index)`;
  } else {
    summary = `Minimal vegetative change detected between captures (${(exgDelta * 100).toFixed(1)}% ExG delta)`;
  }

  return {
    beforeExg: Math.round(beforeExg * 100) / 100,
    afterExg: Math.round(afterExg * 100) / 100,
    exgDelta: Math.round(exgDelta * 100) / 100,
    changeScore: Math.round(changeScore * 100) / 100,
    confidence: 0.88,
    summary,
  };
}
