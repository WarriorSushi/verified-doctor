"use client";

import { useEffect, useRef } from "react";
import { trackEvent, generateVisitorId, getSessionId, detectDeviceType, getReferrer } from "@/lib/analytics";

interface ProfileViewTrackerProps {
  profileId: string;
  viewerProfileId?: string;
  isVerifiedViewer?: boolean;
}

export function ProfileViewTracker({
  profileId,
  viewerProfileId,
  isVerifiedViewer = false
}: ProfileViewTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    // Only track once per mount
    if (tracked.current) return;
    tracked.current = true;

    // Send the view event with all metadata
    const visitorId = generateVisitorId();
    const sessionId = getSessionId();
    const deviceType = detectDeviceType();
    const referrer = getReferrer();

    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profileId,
        eventType: "profile_view",
        viewerProfileId,
        isVerifiedViewer,
        visitorId,
        sessionId,
        deviceType,
        referrer,
      }),
    }).catch(() => {
      // Silently fail - analytics should never break the app
    });
  }, [profileId, viewerProfileId, isVerifiedViewer]);

  // This component renders nothing
  return null;
}
