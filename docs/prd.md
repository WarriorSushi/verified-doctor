# Verified.doctor — Product Requirements Document

## Executive Summary

**Verified.doctor** is the "Blue Checkmark" for medical professionals. A SaaS platform providing doctors with a premium Digital Identity and Reputation Command Center.

Unlike standard website builders or medical directories, this platform focuses on **Status**, **Trust**, and **Network**. It replaces the need for business cards with a dynamic QR code system and provides a professional communication channel between doctors and patients.

**The Domain Advantage:** `verified.doctor` is a category-killing domain. It implies trust, authority, and exclusivity before the user even loads the page.

---

## Core Value Proposition

### For Doctors
- A high-status vanity URL (`verified.doctor/sharma`)
- Protection from negative text reviews (recommendations only)
- A viral way to showcase professional connections
- Professional patient communication without sharing personal contact info
- Zero-maintenance digital presence

### For Patients
- Quick verification of doctor credentials
- Save doctor's contact instantly to phone
- Direct messaging channel to doctor (async, not live chat)
- See social proof (recommendations, peer connections)

---

## The "Hook & Lock" User Journey

### Phase 1: Discovery (FOMO)
Doctor lands on homepage. Sees the typewriter animation cycling through names being claimed. Urgency is created — "Claim your name before someone else takes it."

### Phase 2: The Claim
Doctor types their desired handle (e.g., `verified.doctor/sharma`). System performs real-time availability check. If available, green checkmark appears.

### Phase 3: The Lock (Sign Up)
Doctor enters email and password to "lock" this URL. The handle is now reserved in the database. No one else can claim it.

### Phase 4: Instant Build
Doctor enters basic information:
- Full Name
- Specialty
- Clinic Name & Location
- Profile Photo
- One external link (booking/appointment URL)

### Phase 5: Go Live (Unverified)
The page is published immediately. It is fully functional:
- QR code works
- Recommendations work
- Connections work
- Messaging works

**But:** No "Verified Badge" appears yet. Profile shows as "Member" status.

### Phase 6: The Verification Upsell
Dashboard displays persistent prompt:
- Profile completion bar showing "80% complete"
- Banner: "Your profile is Live but Unverified. Upload documents to get your Verified Badge."
- Clear CTA: "Get Verified Now"

### Phase 7: Document Upload
Doctor uploads 1-3 photos as proof:
- Medical Registration Certificate
- Photo holding ID card
- Any other proof of being a licensed doctor

Images are compressed client-side to <500KB before upload.

### Phase 8: Manual Approval
Admin (you) reviews uploaded documents. Click Approve or Reject.

### Phase 9: Verified Status
Upon approval, the blue/gradient Verified Badge appears on the doctor's public profile. They are now a "Verified Physician."

---

## Core Features

### 1. The Public Profile Page (`verified.doctor/handle`)

**Header Section:**
- Profile photo (circular, high-quality)
- Full name with title
- Verified Badge (if verified) — uses the custom gradient badge SVG
- Specialty and years of experience

**Metrics Section (Social Proof):**
- "Recommended by X Patients" — hidden if zero, shown as ranges (10+, 50+, 100+)
- "Connected with X Doctors" — shows peer network size

**Action Buttons (Sticky on mobile):**
- "Save Contact" — triggers .vcf (vCard) download
- "Send Inquiry" — opens async messaging form
- "Book Appointment" — external link to Calendly/Practo/hospital system

**Engagement Section:**
- Text: "Did you visit Dr. [Name]?"
- Button: "I Recommend This Doctor"
- One tap, no login required for patient
- Simple anti-spam measures (rate limiting, browser fingerprinting)

### 2. The "Risk-Free" Reputation System

**The Problem:** Doctors fear Google/Yelp reviews because anyone can leave negative reviews, including competitors or people who never visited.

**The Solution:** Binary feedback only.
- Patients can ONLY "Recommend" (positive)
- No dislike button
- No text reviews
- No star ratings

**Display Logic:**

| Count | Display |
|-------|---------|
| 0 | Hidden completely |
| 1-10 | "Recommended by patients" (no number) |
| 11-50 | "Recommended by 10+ patients" |
| 51-100 | "Recommended by 50+ patients" |
| 100+ | "Recommended by 100+ patients" |

**Benefit:** Eliminates review anxiety. It's a pure ego-boost mechanism that can only go up.

### 3. The Connections Engine (Viral Loop)

**The Psychology:** Doctors care deeply about peer respect. A doctor with 0 connections looks isolated. A doctor with 50 connections looks like a Key Opinion Leader.

**Connection Methods:**

1. **Invite Flow:**
   - Doctor A clicks "Invite a Colleague" in dashboard
   - Enters colleague's email OR copies invite link
   - When Doctor B signs up using that link, they auto-connect
   - Both doctors' connection counts increase

2. **Request Flow:**
   - If both doctors are already on platform
   - Doctor A searches for Doctor B
   - Sends connection request
   - Doctor B accepts
   - Both are now connected

**Display:** Profile shows "Connected with X Doctors"

**Viral Mechanic:** Every doctor wants a high connection count, so they invite colleagues. Each user becomes a salesperson.

### 4. The Messaging System ("Send Inquiry")

**The Problem:** 
- Doctors don't want to share personal WhatsApp (boundary issues)
- Patients need a way to reach doctors between visits
- Phone tag with clinic reception is frustrating

**The Solution:** Async messaging (like email, not live chat)

**Patient Flow (No Login Required):**
1. Patient clicks "Send Inquiry" on profile
2. Simple form appears:
   - Name (required)
   - Phone number (required)
   - Message (required, max 500 characters)
3. Submits message
4. Sees confirmation: "Message sent. Dr. [Name] typically responds within 24-48 hours."

**Doctor Flow (Dashboard):**
1. Doctor sees "Messages" tab with unread count
2. Each message shows: Patient name, phone, message, timestamp
3. Doctor clicks "Reply"
4. Types response (or uses saved template)
5. Hits send

**Patient Receives Reply:**
- Via SMS to the phone number they provided
- Clean, professional format
- Doctor's personal number is never exposed

**Templates (Future Pro Feature):**
- "I'm on leave until [date]"
- "Please book via [link]"
- "For emergencies, contact [hospital]"

### 5. QR Code System

**Generation:** Each verified profile gets a unique QR code that links to their profile URL.

**Use Case:** Doctor prints and displays in:
- Clinic waiting room
- Reception desk
- Business card
- Prescription pad header

**Patient Scans To:**
- View credentials
- Save contact to phone
- Send a message
- Leave a recommendation

**Display Copy on QR Stand:**
> "Scan to save Dr. [Name]'s contact & send a message"

(Not "Scan to verify credentials" — that implies distrust)

### 6. Doctor Dashboard

**Status Banner:**
- If Unverified: Sticky banner with verification CTA
- If Verified: Green checkmark with "You are a Verified Physician"

**Profile Completion Bar:**
- Shows percentage complete
- Nudges toward: adding photo, verifying, inviting colleagues

**Metrics Cards:**
- Total Profile Views
- Recommendations count
- Connection count
- Messages (unread/total)

**Quick Actions:**
- View/Download QR Code
- Edit Profile
- Invite Colleague
- View Messages

### 7. The Landing Page

**Hero Section:**
- Massive input field mimicking a browser URL bar
- Static text: `verified.doctor/`
- Animated placeholder with typewriter effect cycling through names
- "Check Availability" button (changes to "Claim Name" if available)

**The Name List (15 names, diverse, global):**
Anna, Arjun, Abdul, Chong, Priya, Dave, Fatima, Rohan, Mateo, Wei, Anjali, Kwame, Vikram, Sarah, Meera

**Animation Behavior:**
- Types name character by character
- Pauses 1.5 seconds
- Backspaces character by character
- Types next name
- Stops immediately when user clicks input

**Social Proof (Below Input):**
- "🔥 34 Doctors joined in the last hour"
- "Recently claimed: verified.doctor/priya, verified.doctor/lee"

**Below Fold:**
- Feature highlights (3 cards)
- How it works (3 steps)
- Trust signals

---

## Anti-Spam & Security

### Recommendation Spam Prevention
- Rate limiting: Max 1 recommendation per IP per profile per 24 hours
- Browser fingerprinting for additional uniqueness
- CAPTCHA trigger if suspicious patterns detected

### Handle Squatting Prevention
- Banned words list (offensive terms, medical conditions as handles)
- Handles must be 3-30 characters, alphanumeric + hyphens only
- Reserved handles for future use (admin, support, help, etc.)

### Document Security
- Uploaded verification documents stored in private S3 bucket
- Not publicly accessible
- Deleted after 90 days post-verification (or rejection)

---

## Monetization Strategy

### Phase 1: Free (Growth Phase)
Everything free to build user base and network density.

### Phase 2: Freemium (Post 1,000 users)

| Feature | Free | Pro (₹299/mo) |
|---------|------|---------------|
| Profile & URL | ✓ | ✓ |
| QR Code | Standard B&W | Custom colors |
| Recommendations | ✓ | ✓ |
| Connections | Max 10 | Unlimited |
| Messages | 10/month | Unlimited |
| Analytics | View count only | Full analytics |
| Message Templates | — | ✓ |
| Priority in Directory | — | ✓ |

### Phase 3: Enterprise (Post 10,000 users)
- Hospital/clinic bulk accounts
- API access for integration
- White-label options

### Long-term Revenue Streams
- Lead generation for pharma/medical devices (anonymized, aggregated data)
- Premium verification tiers (video call verification for ₹999)
- Physical QR stands/acrylic displays (high margin upsell)
- Featured listings in search directory

---

## Success Metrics

### North Star Metric
Monthly Active Verified Doctors

### Primary Metrics
- Signups per week
- Verification completion rate
- Invites sent per user
- Connections per user

### Secondary Metrics
- Profile views
- Recommendations given
- Messages sent/replied
- QR code scans (if trackable)

---

## Launch Strategy

### Phase 1: Seed (Week 1-2)
- Soft launch to 50 doctors via personal network
- Offer "Founding Member" badge (cosmetic, free forever)
- Gather feedback, fix bugs

### Phase 2: City Launch (Week 3-4)
- Focus on one city (Bangalore or Mumbai)
- Target 500 doctors
- Learn what resonates, iterate

### Phase 3: National (Month 2-3)
- Open to all of India
- Press/PR push
- Influencer doctors as ambassadors

### Phase 4: International (Month 6+)
- Expand to UAE (large Indian doctor population)
- Then UK, US, Canada

---

## Future Roadmap (Post-Launch)

1. **Search Directory:** "Find a Cardiologist in Mumbai who is Verified"
2. **Tiered Badges:** Silver (verified), Gold (10+ years), Platinum (100+ recommendations)
3. **The Physical Kit:** Premium acrylic QR stands sold to verified doctors
4. **Mobile App:** For doctors to manage messages on the go
5. **NMC API Integration:** Auto-verify using National Medical Commission database
6. **Appointment Booking:** Native booking system (not just external links)
