# Security Audit Report: Verified.Doctor

**Audit Date:** December 31, 2025
**Auditor:** Claude Code Security Analysis
**Codebase:** Verified.Doctor - SaaS platform for doctor digital identity
**Technology Stack:** Next.js 14+, TypeScript, Supabase, Clerk (configured but not integrated)

---

## Executive Summary

This security audit of the Verified.Doctor codebase reveals **several critical and high-severity vulnerabilities** that require immediate attention before production deployment. The primary concerns center around:

1. **Hardcoded credentials and weak secrets** in the admin authentication system
2. **Test authentication system risks** that could be accidentally enabled in production
3. **Missing rate limiting** across all API endpoints, enabling abuse
4. **No CSRF protection** on state-changing API routes
5. **SQL injection potential** in several Supabase query patterns

The codebase demonstrates good practices in some areas (input validation with Zod, proper cookie security flags) but has significant gaps that must be addressed before handling real user data.

---

## Critical Severity Findings

### 1. Hardcoded Admin Credentials (CRITICAL)

**File:** `C:\coding\newverified.doctor\src\lib\admin-auth.ts`

**Description:** The admin authentication system contains hardcoded default credentials that would allow unauthorized access if environment variables are not properly set.

**Vulnerable Code:**
```typescript
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "drsyedirfan93@gmail.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "adminadmin";
const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || "admin-secret-key-change-in-production"
);
```

**Impact:**
- If `ADMIN_EMAIL`, `ADMIN_PASSWORD`, or `ADMIN_JWT_SECRET` environment variables are not set, attackers can:
  - Log in as admin using the default credentials
  - Access all verification documents and user data
  - Approve/reject doctor verifications
  - Forge admin JWT tokens using the predictable secret

**Risk Level:** CRITICAL
**CVSS Score Estimate:** 9.8 (Critical)

**Recommendations:**
1. Remove all default fallback values for credentials
2. Fail startup if required secrets are not configured
3. Use strong, randomly generated JWT secrets (minimum 256-bit)
4. Implement proper secret management (e.g., Vercel environment variables, AWS Secrets Manager)
5. Add login attempt throttling for admin panel

---

### 2. Test Authentication Bypass Risk (CRITICAL)

**Files:**
- `C:\coding\newverified.doctor\src\lib\auth\test-auth.ts`
- `C:\coding\newverified.doctor\src\app\api\test-auth\login\route.ts`

**Description:** The test authentication system allows any user to create arbitrary sessions by setting `NEXT_PUBLIC_ENABLE_TEST_AUTH=true`. This uses a `NEXT_PUBLIC_` prefix, meaning it's exposed to the client.

**Vulnerable Code:**
```typescript
// In test-auth.ts
export async function getAuth(): Promise<{ userId: string | null }> {
  if (process.env.NEXT_PUBLIC_ENABLE_TEST_AUTH === "true") {
    const testUser = await getTestUser();
    if (testUser) {
      return { userId: testUser.userId };
    }
  }
  return { userId: null };
}

// In login route
export async function POST(request: Request) {
  if (process.env.NEXT_PUBLIC_ENABLE_TEST_AUTH !== "true") {
    return NextResponse.json({ error: "Test auth not enabled" }, { status: 403 });
  }
  // Creates session with arbitrary email/name from request body
  let email: string | undefined;
  let name: string | undefined;
  const body = await request.json();
  email = body.email;
  name = body.name;
  const testUser = createTestSession({ email, name });
  // ... sets cookie
}
```

**Impact:**
- If accidentally enabled in production, anyone can impersonate any user
- The `NEXT_PUBLIC_` prefix means the flag value is visible in client-side bundles
- Session cookies have a 30-day expiration, making compromise long-lasting
- Arbitrary user IDs can be generated based on email input

**Risk Level:** CRITICAL
**CVSS Score Estimate:** 10.0 (Critical) when enabled

**Recommendations:**
1. Add production environment check that throws/exits if test auth is enabled
2. Use a server-only environment variable (remove `NEXT_PUBLIC_` prefix)
3. Add monitoring/alerting for test auth usage
4. Reduce test session expiry for development
5. Consider removing test auth entirely and using proper auth testing strategies

---

## High Severity Findings

### 3. No Rate Limiting Implementation (HIGH)

**Affected Files:** All API routes in `C:\coding\newverified.doctor\src\app\api\`

**Description:** Despite the PRD mentioning Upstash Redis for rate limiting and the recommendation system describing "Rate limiting: Max 1 recommendation per IP per profile per 24 hours", no rate limiting is actually implemented anywhere in the codebase.

**Impact:**
- **Recommendation spam:** Attackers can inflate doctor recommendation counts
- **Message flooding:** Patients can spam doctors with unlimited messages
- **Brute force attacks:** Admin login has no protection against password guessing
- **Resource exhaustion:** API endpoints can be hammered, causing service degradation
- **Verification document abuse:** Unlimited upload attempts possible

**Evidence:** Search for "rateLimit", "rate-limit", "RateLimit", "upstash" returned no matches in the codebase.

**Risk Level:** HIGH
**CVSS Score Estimate:** 7.5 (High)

**Recommendations:**
1. Implement Upstash Redis rate limiting as specified in techstack.md
2. Add rate limits to:
   - `/api/recommend` - 1 per IP/profile/24h
   - `/api/messages` - 5 per IP/hour
   - `/api/admin/login` - 5 attempts per IP/15min with exponential backoff
   - `/api/verification` - 3 per user/day
   - `/api/check-handle` - 30 per IP/minute
3. Return proper 429 status codes with Retry-After headers

---

### 4. SQL Injection via Raw String Interpolation (HIGH)

**Affected Files:**
- `C:\coding\newverified.doctor\src\app\api\connections\route.ts`
- `C:\coding\newverified.doctor\src\app\api\admin\users\route.ts`
- `C:\coding\newverified.doctor\src\app\[handle]\page.tsx`

**Description:** Several Supabase queries use string interpolation directly in `.or()` filters without proper parameterization.

**Vulnerable Code:**
```typescript
// In connections/route.ts line 45
.or(`requester_id.eq.${profile.id},receiver_id.eq.${profile.id}`)

// In connections/route.ts line 137
.or(
  `and(requester_id.eq.${requesterProfile.id},receiver_id.eq.${result.data.receiverId}),and(requester_id.eq.${result.data.receiverId},receiver_id.eq.${requesterProfile.id})`
)

// In admin/users/route.ts line 28 - User-controlled input!
if (search) {
  query = query.or(`full_name.ilike.%${search}%,handle.ilike.%${search}%,specialty.ilike.%${search}%`);
}
```

**Impact:**
- The admin user search is especially dangerous as `search` comes directly from URL query parameters
- Attackers could potentially manipulate the PostgREST query syntax
- While Supabase/PostgREST has some built-in protections, this pattern is risky

**Risk Level:** HIGH
**CVSS Score Estimate:** 7.3 (High)

**Recommendations:**
1. Use Supabase's parameterized query methods where possible
2. For the admin search, use separate `.ilike()` calls with proper escaping
3. Validate and sanitize all user input used in queries
4. Consider using Supabase's RPC functions for complex queries

---

### 5. No CSRF Protection (HIGH)

**Description:** The application has no Cross-Site Request Forgery (CSRF) protection on any API routes. All state-changing operations (POST, PATCH, DELETE) are vulnerable.

**Evidence:** Search for "CSRF" or "csrf" returned no matches.

**Impact:**
- An attacker could craft malicious pages that submit forms to:
  - Send messages on behalf of patients
  - Submit recommendations
  - Modify doctor profiles
  - Accept/reject connections
  - Perform admin actions if admin is logged in

**Risk Level:** HIGH
**CVSS Score Estimate:** 6.5 (Medium-High)

**Recommendations:**
1. Implement CSRF tokens using Next.js middleware or a library
2. Add `SameSite=Strict` to sensitive cookies (currently `Lax`)
3. Verify `Origin` and `Referer` headers on state-changing requests
4. Consider implementing double-submit cookie pattern

---

## Medium Severity Findings

### 6. Weak Browser Fingerprinting for Anti-Spam (MEDIUM)

**File:** `C:\coding\newverified.doctor\src\app\api\recommend\route.ts`

**Description:** The recommendation anti-spam system relies on a weak browser fingerprint that can be easily bypassed.

**Vulnerable Code:**
```typescript
function getFingerprint(headersList: Headers): string {
  const userAgent = headersList.get("user-agent") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const acceptEncoding = headersList.get("accept-encoding") || "";

  const data = `${userAgent}|${acceptLanguage}|${acceptEncoding}`;
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}
```

**Impact:**
- Easily bypassed by changing User-Agent or Accept-Language headers
- Simple hash function produces predictable values
- No IP-based rate limiting as backup
- Attackers can artificially inflate recommendation counts

**Risk Level:** MEDIUM
**CVSS Score Estimate:** 5.3 (Medium)

**Recommendations:**
1. Implement proper rate limiting with Upstash Redis
2. Combine IP-based and fingerprint-based checks
3. Add CAPTCHA trigger for suspicious patterns (as mentioned in PRD)
4. Consider using more sophisticated fingerprinting libraries
5. Store and check IP addresses in addition to fingerprints

---

### 7. Missing Input Sanitization for XSS Prevention (MEDIUM)

**Description:** While React provides default XSS protection for JSX rendering, user-supplied content is not explicitly sanitized before database storage. No usage of `dangerouslySetInnerHTML` was found, which is good.

**Potential Risk Areas:**
- Profile fields (bio, services, qualifications) stored as-is
- Message content from patients
- Sender names and phone numbers

**Risk Level:** MEDIUM
**CVSS Score Estimate:** 4.7 (Medium)

**Recommendations:**
1. Add explicit sanitization layer for user input before storage
2. Validate and strip potentially dangerous characters from text fields
3. Consider using a library like DOMPurify for any rich text features
4. Ensure Content Security Policy headers are configured

---

### 8. Automation Endpoint Without Strong Authentication (MEDIUM)

**File:** `C:\coding\newverified.doctor\src\app\api\automation\process\route.ts`

**Description:** The automation email processing endpoint uses an optional secret key that may not be configured.

**Vulnerable Code:**
```typescript
const authHeader = request.headers.get("authorization");
const expectedKey = process.env.AUTOMATION_SECRET_KEY;

// If secret key is configured, verify it
if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

**Impact:**
- If `AUTOMATION_SECRET_KEY` is not set, anyone can access the endpoint
- Could trigger unintended email sends or access queue data
- GET endpoint is completely open and exposes queue statistics

**Risk Level:** MEDIUM
**CVSS Score Estimate:** 5.8 (Medium)

**Recommendations:**
1. Require the secret key (fail if not configured)
2. Restrict to specific IP addresses (cron service IPs)
3. Add authentication to GET endpoint as well
4. Log all access to automation endpoints

---

### 9. Insecure Cookie Configuration for Admin Session (MEDIUM)

**File:** `C:\coding\newverified.doctor\src\app\api\admin\login\route.ts`

**Description:** While cookies have `httpOnly` and conditional `secure` flags, they use `sameSite: "lax"` which allows cross-site GET requests.

**Code:**
```typescript
cookieStore.set("admin_session", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 60 * 60 * 24, // 24 hours
  path: "/",
});
```

**Risk Level:** MEDIUM
**CVSS Score Estimate:** 4.3 (Medium)

**Recommendations:**
1. Use `sameSite: "strict"` for admin session cookies
2. Add domain restriction if applicable
3. Consider shorter session duration for admin
4. Implement session invalidation on password change

---

## Low Severity Findings

### 10. Verbose Error Logging (LOW)

**Description:** Many API routes log full error objects to console, which could expose sensitive information in production logs.

**Example:**
```typescript
console.error("Database error:", error);
console.error("Admin login error:", error);
```

**Risk Level:** LOW
**CVSS Score Estimate:** 3.1 (Low)

**Recommendations:**
1. Implement structured logging with appropriate log levels
2. Avoid logging full error objects in production
3. Use error tracking service (e.g., Sentry as mentioned in techstack.md)

---

### 11. Missing Security Headers (LOW)

**File:** `C:\coding\newverified.doctor\next.config.ts`

**Description:** No security headers are configured in Next.js config.

**Missing Headers:**
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
- Permissions-Policy

**Risk Level:** LOW
**CVSS Score Estimate:** 3.7 (Low)

**Recommendations:**
1. Add security headers in Next.js middleware or config
2. Implement strict Content Security Policy
3. Add X-Frame-Options: DENY
4. Configure proper CORS if needed

---

### 12. Limited Banned Handle List (LOW)

**File:** `C:\coding\newverified.doctor\src\lib\banned-handles.ts`

**Description:** The banned handles list is minimal and may not prevent all handle squatting or impersonation.

**Missing Categories:**
- Common misspellings of admin routes
- Medical specialty names
- Famous doctor names
- Profanity and slurs (noted as "basic list")

**Risk Level:** LOW
**CVSS Score Estimate:** 2.4 (Low)

**Recommendations:**
1. Expand the list significantly
2. Add pattern matching for variations
3. Consider dynamic blacklist from database
4. Add manual review for short handles (< 5 chars)

---

## Positive Security Practices Observed

1. **Input Validation:** Consistent use of Zod schemas for request validation
2. **UUID Validation:** Profile and message IDs validated as UUIDs
3. **Handle Validation:** Strong regex patterns preventing XSS in URLs
4. **Ownership Verification:** Profile updates check user ownership before modification
5. **Cookie Flags:** httpOnly and conditional secure flags are set
6. **File Upload Validation:** Type and size limits on verification documents
7. **Soft Delete:** Messages use soft delete preventing permanent data loss
8. **Admin Route Protection:** All admin routes verify admin session
9. **No dangerouslySetInnerHTML:** No usage of dangerous React patterns found

---

## Remediation Priority Matrix

| Priority | Finding | Effort | Impact |
|----------|---------|--------|--------|
| P0 - Immediate | Hardcoded Admin Credentials | Low | Critical |
| P0 - Immediate | Test Auth Production Risk | Low | Critical |
| P1 - This Sprint | No Rate Limiting | Medium | High |
| P1 - This Sprint | SQL Injection Patterns | Medium | High |
| P1 - This Sprint | No CSRF Protection | Medium | High |
| P2 - Next Sprint | Weak Fingerprinting | Low | Medium |
| P2 - Next Sprint | Input Sanitization | Medium | Medium |
| P2 - Next Sprint | Automation Auth | Low | Medium |
| P2 - Next Sprint | Cookie Configuration | Low | Medium |
| P3 - Backlog | Error Logging | Low | Low |
| P3 - Backlog | Security Headers | Low | Low |
| P3 - Backlog | Banned Handle List | Low | Low |

---

## Conclusion

The Verified.Doctor codebase has **critical security vulnerabilities** that must be addressed before production deployment. The most urgent issues are:

1. **Remove hardcoded credentials** and enforce environment variable configuration
2. **Add production guard** to prevent test authentication from being enabled
3. **Implement rate limiting** across all public API endpoints
4. **Fix SQL injection patterns** in Supabase queries
5. **Add CSRF protection** to state-changing routes

Once these critical and high-severity issues are resolved, the codebase will have a solid security foundation. The use of TypeScript, Zod validation, and proper ownership checks demonstrates good security awareness that just needs to be extended to cover the gaps identified in this audit.

---

*This report was generated by automated security analysis and should be validated by a security professional before implementation of fixes.*
