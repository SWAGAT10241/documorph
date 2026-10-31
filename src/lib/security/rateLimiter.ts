/**
 * In-memory sliding-window rate limiter for API endpoints.
 * Protects against brute-force, DoS, and automated scraping.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up stale IPs periodically (every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of rateLimitStore.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 60000);
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(ip);
      }
    }
  }, 300000);
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetInSeconds: number;
}

/**
 * Checks if a client IP is within rate limits.
 * Default: 10 requests per 60 seconds.
 */
export function checkRateLimit(
  clientIp: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): RateLimitResult {
  const now = Date.now();
  const record = rateLimitStore.get(clientIp) || { timestamps: [] };

  // Filter out timestamps outside the active sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= maxRequests) {
    const oldestTimestamp = record.timestamps[0];
    const resetInSeconds = Math.max(1, Math.ceil((oldestTimestamp + windowMs - now) / 1000));
    return {
      allowed: false,
      limit: maxRequests,
      remaining: 0,
      resetInSeconds,
    };
  }

  // Record this request
  record.timestamps.push(now);
  rateLimitStore.set(clientIp, record);

  const resetInSeconds = Math.ceil(windowMs / 1000);
  return {
    allowed: true,
    limit: maxRequests,
    remaining: maxRequests - record.timestamps.length,
    resetInSeconds,
  };
}
