# Verified.Doctor - Edge Case Analysis Report

**Date:** December 31, 2025
**Analyzed By:** QA Engineer (Claude)
**Codebase Path:** C:\coding\newverified.doctor

---

## Executive Summary

This report identifies potential edge cases and breaking points in the Verified.Doctor codebase. The analysis covers API routes, database operations, component state management, input validation, authentication, and network failure handling.

**Overall Risk Assessment:** MEDIUM-HIGH

The codebase has solid basic error handling with try/catch blocks and Zod validation, but several critical race conditions and edge cases could cause issues in production.

---

## Critical Edge Cases (High Priority)

### 1. Race Condition: Handle Claiming

**Location:** `src/app/api/profiles/route.ts` (lines 90-102)

**Issue:** Time-of-check to time-of-use (TOCTOU) vulnerability when claiming a handle.

**Scenario:**
1. User A checks if handle "sharma" is available (returns true)
2. User B checks if handle "sharma" is available (returns true)
3. User A creates profile with "sharma" handle
4. User B creates profile with "sharma" handle (may succeed if no DB constraint)

**Current Code:**
```typescript
// Check if handle is already taken
const { data: existingHandle } = await supabase
  .from("profiles")
  .select("handle")
  .eq("handle", handle)
  .single();

if (existingHandle) {
  return NextResponse.json({ error: "This handle is already taken" }, { status: 400 });
}

// ... later creates profile
```

**Impact:** Two users could end up with the same handle if requests are concurrent.

**Recommended Fix:**
- Add a UNIQUE constraint on the `handle` column in the database (if not already present)
- Wrap the check and insert in a database transaction
- Handle the unique constraint violation error gracefully

---

### 2. Race Condition: Connection Count Increment/Decrement

**Location:** `src/app/api/connections/[id]/route.ts` (lines 183-197)

**Issue:** Non-atomic read-modify-write pattern for connection counts.

**Current Code:**
```typescript
const { data: profiles } = await supabase
  .from("profiles")
  .select("id, connection_count")
  .in("id", [connection.requester_id, connection.receiver_id]);

if (profiles) {
  for (const p of profiles) {
    await supabase
      .from("profiles")
      .update({ connection_count: Math.max(0, (p.connection_count || 0) - 1) })
      .eq("id", p.id);
  }
}
```

**Impact:** Concurrent connection deletions could lead to incorrect connection counts.

**Recommended Fix:** Use a database function with atomic increment/decrement operations (like `increment_connection_counts` RPC that already exists for incrementing).

---

### 3. Invite Code Collision

**Location:** `src/app/api/invites/route.ts` (line 43)

**Issue:** Random invite code generation without collision checking.

**Current Code:**
```typescript
const inviteCode = randomBytes(6).toString("hex");
```

**Impact:** While statistically unlikely (12-character hex = 16^12 possibilities), there's no check for existing codes. A collision would cause a database error.

**Recommended Fix:**
- Add retry logic if insert fails due to unique constraint
- Or verify code doesn't exist before insert

---

### 4. Missing Rate Limiting on Critical Endpoints

**Location:** Multiple API routes

**Affected Endpoints:**
- `/api/profiles` POST - Profile creation
- `/api/messages` POST - Message sending (has IP comment but no implementation)
- `/api/recommend` POST - Recommendation (fingerprint-based, but no IP rate limit)
- `/api/check-handle` POST - Handle availability check

**Current State:** The code mentions rate limiting in comments but Upstash Redis is not integrated.

**Impact:**
- Handle squatting via automated requests
- Spam recommendations from different browsers on same IP
- Message flooding
- DoS via expensive database queries

**Recommended Fix:** Implement Upstash Redis rate limiting as specified in the tech stack.

---

### 5. Admin Authentication Hardcoded Credentials

**Location:** `src/lib/admin-auth.ts` (lines 4-8)

**Issue:** Default hardcoded credentials for admin panel.

**Current Code:**
```typescript
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "drsyedirfan93@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "adminadmin";
const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "admin-secret-key-change-in-production"
);
```

**Impact:** If environment variables are not set, anyone can access admin with default credentials.

**Recommended Fix:**
- Remove default fallback values
- Make the application fail to start if admin env vars are missing
- Use a more secure default JWT secret or require it to be set

---

## Medium Risk Edge Cases

### 6. Null/Undefined Handling in Profile Templates

**Location:** `src/components/profile/templates/classic-template.tsx` (lines 65-66)

**Issue:** Potential crash if `full_name` is somehow empty.

**Current Code:**
```typescript
const firstName = profile.full_name.split(" ")[0];
```

**Impact:** If `full_name` is an empty string or undefined, this would crash.

**Scenario:** Database corruption or manual DB edit could cause this.

**Recommended Fix:**
```typescript
const firstName = profile.full_name?.split(" ")[0] || "Doctor";
```

---

### 7. Phone Number Validation Too Permissive

**Location:** `src/app/api/messages/route.ts` (line 9)

**Issue:** Phone validation only checks length, not format.

**Current Code:**
```typescript
senderPhone: z.string().min(10, "Valid phone number required").max(20),
```

**Impact:** Invalid phone numbers can be stored, making SMS replies impossible.

**Recommended Fix:** Add regex validation for phone format:
```typescript
senderPhone: z.string().regex(/^\+?[1-9]\d{9,14}$/, "Valid phone number required")
```

---

### 8. File Upload Size Check Client-Side Only

**Location:** `src/app/api/verification/route.ts` (lines 64-77)

**Issue:** While server validates file type and size, the 5MB limit is generous. Large files consume bandwidth before being rejected.

**Current Code:**
```typescript
const maxSize = 5 * 1024 * 1024; // 5MB
```

**Scenario:** User uploads three 5MB files = 15MB upload before server validates.

**Recommended Fix:**
- Reduce max size to 2MB
- Add client-side validation before upload (already mentioned in PRD as <500KB)
- Use streaming uploads with early size rejection

---

### 9. Unhandled JSON Parse Errors

**Location:** Multiple API routes

**Issue:** `await request.json()` can throw if body is malformed.

**Example:** `src/app/api/check-handle/route.ts` (line 25)

**Current Code:**
```typescript
const body = await request.json();
```

**Impact:** Malformed JSON causes 500 error instead of 400 Bad Request.

**Recommended Fix:** Wrap in try/catch with specific error handling:
```typescript
let body;
try {
  body = await request.json();
} catch {
  return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
}
```

---

### 10. Profile Photo URL Injection

**Location:** `src/app/api/profiles/route.ts` (lines 27, 129)

**Issue:** Profile photo URL is accepted as a string URL without validation of the domain/source.

**Current Code:**
```typescript
profilePhotoUrl: z.string().url().optional().or(z.literal("")),
// ...later...
profile_photo_url: profilePhotoUrl || null,
```

**Impact:** Users could inject malicious URLs or URLs to inappropriate content.

**Recommended Fix:**
- Validate URL is from trusted domains (e.g., Supabase storage)
- Or require photo upload through your storage API only

---

### 11. Session Cookie Not HttpOnly

**Location:** `src/app/api/test-auth/login/route.ts` (not shown but implied)

**Issue:** Test auth session cookie configuration unknown. If not HttpOnly, vulnerable to XSS.

**Recommended Fix:** Ensure all session cookies use:
```typescript
{ httpOnly: true, secure: true, sameSite: 'lax' }
```

---

### 12. Recommendation Fingerprint Easily Spoofable

**Location:** `src/app/api/recommend/route.ts` (lines 11-25)

**Issue:** Fingerprint based only on User-Agent, Accept-Language, and Accept-Encoding headers.

**Current Code:**
```typescript
function getFingerprint(headersList: Headers): string {
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const acceptEncoding = headersList.get("accept-encoding") || "";
  // ...
}
```

**Impact:**
- Easy to fake recommendations by modifying headers
- Different browsers/devices from same person are treated as different users

**Recommended Fix:**
- Add IP address to fingerprint
- Implement more robust browser fingerprinting (canvas, WebGL)
- Consider CAPTCHA for suspicious patterns

---

## Low Risk Edge Cases

### 13. Empty Services Array Display

**Location:** `src/components/profile/templates/classic-template.tsx` (line 65)

**Issue:** Services string parsing could result in empty strings in array.

**Current Code:**
```typescript
const services = profile.services?.split(",").map((s) => s.trim()).filter(Boolean) || [];
```

**Note:** Already has `.filter(Boolean)` which handles this. Good practice.

---

### 14. Stale Messages After Reply

**Location:** `src/components/dashboard/message-list.tsx` (lines 80-85)

**Issue:** After sending reply, local state is updated but page isn't refreshed. Other tabs/windows won't see the update.

**Current Code:**
```typescript
setSelectedMessage({
  ...selectedMessage,
  reply_content: replyContent,
  reply_sent_at: new Date().toISOString(),
});
```

**Impact:** Minor UX issue - data freshness between tabs.

**Recommended Fix:** Use React Query or SWR for automatic revalidation.

---

### 15. Handle Validation Inconsistency

**Locations:**
- `src/app/api/check-handle/route.ts` (lines 6-21)
- `src/app/api/profiles/route.ts` (lines 7-21)

**Issue:** Same validation schema duplicated in two places.

**Impact:** If one is updated but not the other, validation becomes inconsistent.

**Recommended Fix:** Extract to shared validation schema in `src/lib/validations.ts`.

---

### 16. Bio Character Counter Off-by-One Display

**Location:** `src/components/profile/templates/classic-template.tsx` (lines 69-70)

**Issue:** Bio truncation uses 150 chars, but the PRD mentions 500 max for bio.

**Current Code:**
```typescript
const bioTruncated = profile.bio && profile.bio.length > 150
  ? profile.bio.slice(0, 150).trim() + "..."
  : profile.bio;
```

**Note:** This is display truncation, not validation. The "..." adds 3 chars. Minor.

---

### 17. Missing Error Boundary

**Location:** Client components throughout the app

**Issue:** No React Error Boundaries to catch rendering errors.

**Impact:** A single component crash could white-screen the entire page.

**Recommended Fix:** Add Error Boundary components at layout level:
```tsx
// src/app/error.tsx
'use client'
export default function Error({ error, reset }) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
```

---

### 18. Deleted Messages Still Counted

**Location:** `src/app/api/messages/[id]/route.ts` vs `src/app/(dashboard)/dashboard/page.tsx`

**Issue:** Unread count query doesn't filter deleted messages.

**Dashboard Code:**
```typescript
const { count: unreadCount } = await supabase
  .from("messages")
  .select("*", { count: "exact", head: true })
  .eq("profile_id", profile.id)
  .eq("is_read", false);
  // Missing: .is("deleted_at", null)
```

**Messages List Code:**
```typescript
.is("deleted_at", null)
```

**Impact:** Unread badge count includes soft-deleted messages.

**Recommended Fix:** Add `.is("deleted_at", null)` to unread count query.

---

### 19. Integer Overflow in Typewriter Animation

**Location:** Hero section typewriter effect

**Issue:** `joinedCount` increments indefinitely with setInterval.

**Current Code:**
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    if (Math.random() > 0.7) {
      setJoinedCount((prev) => prev + 1);
    }
  }, 5000);
  return () => clearInterval(interval);
}, []);
```

**Impact:** After extended browser session, number could get very large (though unlikely to overflow JS number).

**Recommended Fix:** Cap at a reasonable maximum:
```typescript
setJoinedCount((prev) => Math.min(prev + 1, 9999));
```

---

### 20. Timezone Issues in Timestamps

**Location:** Various places using `new Date().toISOString()`

**Issue:** All timestamps use UTC, but displayed using `formatDistanceToNow` which uses local time.

**Impact:** Minor - "just now" might show as "1 hour ago" for users in different timezones if server timezone differs.

**Note:** Generally handled well by date-fns, but be aware.

---

## Network Failure Scenarios

### 21. No Retry Logic for Failed API Calls

**Location:** All client-side fetch calls

**Issue:** If a network request fails, there's no automatic retry.

**Example from onboarding:**
```typescript
const response = await fetch("/api/profiles", {
  method: "POST",
  // ...
});
```

**Recommended Fix:** Use a fetch wrapper with exponential backoff for critical operations.

---

### 22. No Offline Detection

**Issue:** App doesn't detect if user goes offline.

**Impact:** Users may submit forms when offline, leading to confusing failures.

**Recommended Fix:** Add online/offline detection and show appropriate UI.

---

## Database Edge Cases

### 23. Foreign Key Violations on Profile Delete

**Issue:** If a profile is deleted (if that feature exists), all related records (messages, connections, invites, recommendations, verification_documents) would need cascade delete or would cause FK violations.

**Recommended Fix:** Ensure ON DELETE CASCADE or soft deletes for all related tables.

---

### 24. Concurrent Recommendation + Profile Delete

**Scenario:**
1. User starts recommendation flow
2. Profile owner deletes profile
3. Recommendation insert fails with FK violation

**Impact:** 500 error to patient

**Recommended Fix:** Check profile exists right before insert, and handle FK errors gracefully.

---

## Security Considerations

### 25. XSS in User-Generated Content

**Locations:**
- `message_content` in messages
- `bio`, `specialty`, `clinic_name` in profiles
- `sender_name` in messages

**Current State:** React auto-escapes by default, but need to verify no `dangerouslySetInnerHTML` usage.

**Status:** Appears safe - no dangerous HTML rendering found.

---

### 26. IDOR (Insecure Direct Object Reference) Testing

**Tested Endpoints:**
- `/api/profiles/[id]` - Verified owner check exists
- `/api/messages/[id]` - Verified profile_id check exists
- `/api/connections/[id]` - Verified requester/receiver check exists

**Status:** PASS - All endpoints verify ownership before operations.

---

## Recommendations Summary

### Immediate Action Required:
1. Add rate limiting to all public endpoints (Upstash Redis)
2. Fix race condition in handle claiming (DB transaction + unique constraint)
3. Remove hardcoded admin credentials fallbacks
4. Add Error Boundaries to React app

### Should Fix Soon:
5. Add proper phone number validation
6. Implement retry logic for critical API calls
7. Fix unread message count to exclude deleted
8. Make atomic connection count operations

### Good to Have:
9. Extract shared validation schemas
10. Add offline detection
11. Improve recommendation fingerprinting
12. Add structured logging for debugging

---

## Files Analyzed

| Category | Files Reviewed |
|----------|----------------|
| API Routes | 30 files in `src/app/api/` |
| Pages | 17 files in `src/app/` |
| Components | 10+ component files |
| Lib | 8 files in `src/lib/` |

---

## Testing Recommendations

### Manual Test Cases to Add:
1. Claim same handle from two browser tabs simultaneously
2. Send 100 recommendations rapidly from same IP
3. Upload malformed JSON to all POST endpoints
4. Access admin panel without setting env vars
5. Delete connection while counting query is running
6. Submit form, go offline, then retry

### Automated Test Coverage Needed:
- Unit tests for validation schemas
- Integration tests for auth flows
- E2E tests for critical paths (signup, profile creation, messaging)

---

*End of Report*
