import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { headers } from "next/headers";

// Create Redis client - will be null if env vars not configured
let redis: Redis | null = null;

function getRedis(): Redis | null {
  if (redis) return redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.warn("[rate-limit] Upstash Redis not configured. Rate limiting disabled.");
    return null;
  }

  redis = new Redis({ url, token });
  return redis;
}

// Type for rate limit result
export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

// Rate limiters for different use cases
// Note: These are created lazily to avoid errors when Redis is not configured

// Recommendation: 1 per IP per profile per 24 hours
export function getRecommendationLimiter(): Ratelimit | null {
  const redisClient = getRedis();
  if (!redisClient) return null;

  return new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(1, "24h"),
    prefix: "ratelimit:recommendation",
    analytics: true,
  });
}

// Messages: 5 per IP per hour
export function getMessageLimiter(): Ratelimit | null {
  const redisClient = getRedis();
  if (!redisClient) return null;

  return new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(5, "1h"),
    prefix: "ratelimit:message",
    analytics: true,
  });
}

// General API: 100 per IP per minute
export function getApiLimiter(): Ratelimit | null {
  const redisClient = getRedis();
  if (!redisClient) return null;

  return new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(100, "1m"),
    prefix: "ratelimit:api",
    analytics: true,
  });
}

// Admin login: 5 attempts per IP per 15 minutes
export function getAdminLoginLimiter(): Ratelimit | null {
  const redisClient = getRedis();
  if (!redisClient) return null;

  return new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(5, "15m"),
    prefix: "ratelimit:admin-login",
    analytics: true,
  });
}

// Handle check: 30 per IP per minute (prevent enumeration)
export function getHandleCheckLimiter(): Ratelimit | null {
  const redisClient = getRedis();
  if (!redisClient) return null;

  return new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(30, "1m"),
    prefix: "ratelimit:handle-check",
    analytics: true,
  });
}

// Invite creation: 10 per user per hour
export function getInviteLimiter(): Ratelimit | null {
  const redisClient = getRedis();
  if (!redisClient) return null;

  return new Ratelimit({
    redis: redisClient,
    limiter: Ratelimit.slidingWindow(10, "1h"),
    prefix: "ratelimit:invite",
    analytics: true,
  });
}

// Helper to get client IP from request headers
export async function getClientIp(): Promise<string> {
  const headersList = await headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  const realIp = headersList.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "unknown";
}

// Helper function to check rate limit with graceful fallback
export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string
): Promise<RateLimitResult> {
  // If limiter is not available (Redis not configured), allow the request
  if (!limiter) {
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: 0,
    };
  }

  try {
    const result = await limiter.limit(identifier);

    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
      retryAfter: result.success ? undefined : Math.ceil((result.reset - Date.now()) / 1000),
    };
  } catch (error) {
    // On error, log and allow the request (graceful degradation)
    console.error("[rate-limit] Error checking rate limit:", error);
    return {
      success: true,
      limit: 0,
      remaining: 0,
      reset: 0,
    };
  }
}

// Format retry after time for user-friendly message
export function formatRetryAfter(seconds: number): string {
  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? "s" : ""}`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
}
