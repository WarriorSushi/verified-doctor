# Pending Things - Verified.Doctor

This file tracks features and tasks that need to be implemented before/after launch.

---

## 🔴 High Priority (Before Production)

### 1. Admin Panel Security
Update `.env` with secure credentials before deploying to production:

```env
ADMIN_EMAIL=drsyedirfan93@gmail.com
ADMIN_PASSWORD=<use-a-strong-password-not-adminadmin>
ADMIN_JWT_SECRET=<generate-random-32-char-string>
```

**Current dev credentials (CHANGE THESE):**
- Email: `drsyedirfan93@gmail.com`
- Password: `adminadmin`

### 2. Message Reply System
Currently patients can send inquiries but doctors cannot reply. Options to implement:

| Option | Cost | Notes |
|--------|------|-------|
| **Email via Resend** | Free (3k/mo) | Already in stack, simple |
| **Magic Link Inbox** | Free | Patients view replies on website |
| **SMS via MSG91** | ~₹0.15/SMS | Original plan, costs money |
| **WhatsApp Business** | ~₹0.50/msg | Popular in India |

**Recommended:** Email + Magic Link combo (free)

**Files to modify:**
- `src/app/api/messages/[id]/reply/route.ts` - Add email sending
- `src/components/dashboard/message-list.tsx` - Update UI
- Create magic link inbox page for patients

---

## 🟡 Medium Priority (Post-Launch Polish)

### 3. Email Notifications
Implement transactional emails using Resend:
- [ ] Welcome email on signup
- [ ] Verification approved notification
- [ ] Verification rejected notification
- [ ] New message notification to doctor

### 4. Rate Limiting
Add Upstash Redis rate limiting for:
- [ ] Recommendation submissions (prevent spam)
- [ ] Message sending (prevent abuse)
- [ ] Login attempts (prevent brute force)

**Config needed in `.env`:**
```env
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

### 5. CAPTCHA Protection
Add CAPTCHA (reCAPTCHA or hCaptcha) for:
- [ ] Recommendation button (if suspicious patterns)
- [ ] Message form (optional)

---

## 🟢 Low Priority (Future Features)

### 6. Search Directory
Allow patients to search for doctors by:
- Specialty
- Location
- Verified status

**PRD Reference:** Phase 2 feature

### 7. Analytics Dashboard
Enhanced analytics for doctors:
- Profile view trends over time
- Recommendation sources
- QR code scan tracking

### 8. Mobile App
React Native app for doctors to:
- Manage messages on the go
- Get push notifications
- View analytics

### 9. Physical QR Kit
E-commerce for premium acrylic QR stands:
- Design templates
- Stripe payment integration
- Shipping integration

### 10. NMC API Integration
Auto-verify doctors using National Medical Commission database:
- API integration
- Automated verification flow

---

## 🐛 Minor Fixes (Tech Debt)

### Unused Variables (Lint Warnings)
These don't break anything but should be cleaned up:
- `src/app/api/profiles/route.ts:3` - `createAdminClient` unused
- `src/components/dashboard/message-list.tsx:31` - `profileId` unused
- `src/components/shared/typewriter.tsx:21` - `onFocus` unused

---

## ✅ Recently Completed

- [x] Template ID mismatch in onboarding (fixed)
- [x] Lint errors - apostrophe escaping (fixed)
- [x] Profile completion bar in dashboard (added)
- [x] Connection count decrement on disconnect (fixed)
- [x] Admin panel for verification approvals (built)

---

*Last updated: December 31, 2024*
