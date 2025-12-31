// Analytics tracking utilities

export type AnalyticsEventType =
  | "profile_view"
  | "click_save_contact"
  | "click_book_appointment"
  | "click_send_inquiry"
  | "click_recommend"
  | "click_share"
  | "inquiry_sent"
  | "recommendation_given";

interface TrackEventOptions {
  profileId: string;
  eventType: AnalyticsEventType;
  viewerProfileId?: string;
  isVerifiedViewer?: boolean;
  sessionId?: string;
}

/**
 * Track an analytics event (client-side)
 */
export async function trackEvent(options: TrackEventOptions): Promise<void> {
  try {
    await fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(options),
    });
  } catch (error) {
    // Silently fail - analytics should never break the app
    console.error("Analytics tracking failed:", error);
  }
}

/**
 * Generate a simple visitor ID based on browser fingerprinting
 * Used for unique visitor tracking
 */
export function generateVisitorId(): string {
  if (typeof window === "undefined") return "";

  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width + "x" + screen.height,
    new Date().getTimezoneOffset().toString(),
  ];

  // Simple hash function
  let hash = 0;
  const str = components.join("|");
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }

  return Math.abs(hash).toString(16);
}

/**
 * Generate a session ID (persists for the browser session)
 */
export function getSessionId(): string {
  if (typeof window === "undefined") return "";

  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2) + Date.now().toString(36);
    sessionStorage.setItem("analytics_session_id", sessionId);
  }
  return sessionId;
}

/**
 * Detect device type from user agent
 */
export function detectDeviceType(): "mobile" | "tablet" | "desktop" {
  if (typeof window === "undefined") return "desktop";

  const ua = navigator.userAgent.toLowerCase();

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(ua)) {
    return "mobile";
  }
  return "desktop";
}

/**
 * Get referrer information
 */
export function getReferrer(): string {
  if (typeof window === "undefined") return "";
  return document.referrer || "direct";
}
