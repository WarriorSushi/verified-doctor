"use client";

export function TestAuthBanner() {
  // Only show if test auth is enabled
  if (process.env.NEXT_PUBLIC_ENABLE_TEST_AUTH !== "true") {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-amber-500 text-amber-950 text-center py-1.5 text-sm font-medium z-50">
      Test Authentication Active - Development Mode Only
    </div>
  );
}
