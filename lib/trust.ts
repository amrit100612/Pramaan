import crypto from "crypto";

export interface GeoLocation {
  latitude: number;
  longitude: number;
}

export interface Geofence {
  center: GeoLocation;
  radiusMeters: number;
}

export interface AssetTrustData {
  id: string;
  capturedAt?: string | null;
  location?: GeoLocation | null;
  phash?: string | null;
  blurScore?: number | null; // e.g. Laplacian variance or quality score
}

export interface TrustCheckResult {
  geofenceOk: boolean;
  timestampOk: boolean;
  duplicateFlag: boolean;
  baseTrust: number; // 0.0 - 1.0
  flags: string[];
}

export interface CompactEvidenceState {
  stateHash: string;
  claimId: string;
  claimText: string;
  citedAssets: Array<{
    assetId: string;
    caption: string;
    capturedAt?: string;
    locationDistanceMeters?: number;
    trustScore: number;
    tags: string[];
  }>;
  overallTrustLevel: number;
  anomaliesDetected: string[];
}

/**
 * Calculates great circle distance between two points in meters (Haversine formula).
 */
export function calculateDistanceMeters(
  loc1: GeoLocation,
  loc2: GeoLocation
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (loc1.latitude * Math.PI) / 180;
  const phi2 = (loc2.latitude * Math.PI) / 180;
  const deltaPhi = ((loc2.latitude - loc1.latitude) * Math.PI) / 180;
  const deltaLambda = ((loc2.longitude - loc1.longitude) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) *
      Math.cos(phi2) *
      Math.sin(deltaLambda / 2) *
      Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Computes Hamming distance between two binary/hex pHash strings.
 * Distance <= 10 indicates duplicate or derived reuse.
 */
export function calculatePhashDistance(phash1: string, phash2: string): number {
  if (!phash1 || !phash2 || phash1.length !== phash2.length) return 64;
  let distance = 0;
  for (let i = 0; i < phash1.length; i++) {
    const n1 = parseInt(phash1[i], 16);
    const n2 = parseInt(phash2[i], 16);
    let xor = n1 ^ n2;
    while (xor > 0) {
      distance += xor & 1;
      xor >>= 1;
    }
  }
  return distance;
}

/**
 * Evaluates deterministic trust factors on an asset.
 */
export function evaluateAssetTrust(
  asset: AssetTrustData,
  options?: {
    geofence?: Geofence;
    knownPhashes?: string[];
    maxTimestampDriftDays?: number;
  }
): TrustCheckResult {
  const flags: string[] = [];
  let score = 1.0;

  // 1. Geofence check
  let geofenceOk = true;
  if (options?.geofence && asset.location) {
    const dist = calculateDistanceMeters(asset.location, options.geofence.center);
    if (dist > options.geofence.radiusMeters) {
      geofenceOk = false;
      flags.push(`Outside geofence (${Math.round(dist)}m > ${options.geofence.radiusMeters}m)`);
      score -= 0.35;
    }
  } else if (!asset.location) {
    flags.push("Missing location metadata");
    score -= 0.15;
  }

  // 2. Timestamp check
  let timestampOk = true;
  if (asset.capturedAt) {
    const captured = new Date(asset.capturedAt).getTime();
    const now = Date.now();
    // Cannot be in the future
    if (captured > now + 3600000) {
      timestampOk = false;
      flags.push("Capture timestamp is in the future");
      score -= 0.4;
    }
  } else {
    flags.push("Missing capture timestamp");
    score -= 0.15;
  }

  // 3. Duplicate / Reuse detection via pHash
  let duplicateFlag = false;
  if (asset.phash && options?.knownPhashes) {
    for (const known of options.knownPhashes) {
      if (calculatePhashDistance(asset.phash, known) <= 10) {
        duplicateFlag = true;
        flags.push("Potential media reuse / duplicate detected via pHash");
        score -= 0.5;
        break;
      }
    }
  }

  const baseTrust = Math.max(0.0, Math.min(1.0, score));

  return {
    geofenceOk,
    timestampOk,
    duplicateFlag,
    baseTrust,
    flags,
  };
}

/**
 * Builds a compact Evidence State JSON (few hundred tokens max).
 * Per Rules.md: Never send raw EXIF blobs or full asset records to Jev.
 */
export function buildEvidenceState(params: {
  claimId: string;
  claimText: string;
  assets: Array<{
    id: string;
    caption?: string;
    capturedAt?: string;
    location?: GeoLocation | null;
    tags?: string[];
    trustResult: TrustCheckResult;
  }>;
  projectGeofenceCenter?: GeoLocation;
}): CompactEvidenceState {
  const anomalies: string[] = [];
  const citedAssets = params.assets.map((a) => {
    let distance: number | undefined;
    if (a.location && params.projectGeofenceCenter) {
      distance = Math.round(calculateDistanceMeters(a.location, params.projectGeofenceCenter));
    }
    if (a.trustResult.flags.length > 0) {
      anomalies.push(...a.trustResult.flags);
    }
    return {
      assetId: a.id,
      caption: a.caption || "No caption available",
      capturedAt: a.capturedAt,
      locationDistanceMeters: distance,
      trustScore: a.trustResult.baseTrust,
      tags: (a.tags || []).slice(0, 8),
    };
  });

  const avgTrust =
    citedAssets.length > 0
      ? citedAssets.reduce((sum, item) => sum + item.trustScore, 0) / citedAssets.length
      : 0.0;

  // Generate deterministic state hash
  const rawPayload = JSON.stringify({
    claimId: params.claimId,
    claimText: params.claimText,
    citedAssets,
  });
  const stateHash = crypto.createHash("sha256").update(rawPayload).digest("hex").slice(0, 16);

  return {
    stateHash,
    claimId: params.claimId,
    claimText: params.claimText,
    citedAssets,
    overallTrustLevel: Math.round(avgTrust * 100) / 100,
    anomaliesDetected: Array.from(new Set(anomalies)),
  };
}
