# Verified.doctor — Implementation Guide

## Overview

This document provides step-by-step instructions to build Verified.doctor. No code snippets — just clear, plain English directions that you can hand to an AI coding assistant (Cursor, Claude, Copilot) or follow yourself.

---

## Phase 1: Project Setup

### Step 1.1: Initialize the Project

Create a new Next.js project with TypeScript and Tailwind CSS enabled. Use the App Router (not Pages Router). Name the project `verified-doctor`.

### Step 1.2: Install shadcn/ui

Initialize shadcn/ui in the project. When prompted, choose the "New York" style and "Slate" as the base color. Enable CSS variables.

Install these shadcn components: Button, Input, Card, Dialog, Avatar, Badge, Form, Tabs, Toast, Skeleton, Label, Textarea.

### Step 1.3: Install Additional Dependencies

Add these packages:
- `@clerk/nextjs` for authentication
- `@supabase/supabase-js` for database
- `framer-motion` for animations
- `qrcode` for QR code generation
- `browser-image-compression` for client-side image compression
- `zod` for form validation
- `react-hook-form` for form handling

### Step 1.4: Environment Variables

Create a `.env.local` file with placeholders for:
- Clerk publishable key and secret key
- Supabase URL and anon key
- Supabase service role key (for admin operations)
- MSG91 API key (for SMS)
- Resend API key (for email)

### Step 1.5: Configure Clerk

Set up Clerk middleware to protect dashboard routes. Public routes should include the homepage, public profile pages (`/[handle]`), and API routes for recommendations.

---

## Phase 2: Database Setup

### Step 2.1: Create Supabase Project

Create a new project in Supabase. Note down the project URL and anon key.

### Step 2.2: Create Tables

Create the following tables in Supabase:

**Table: profiles**
- `id` — UUID, primary key, auto-generated
- `clerk_user_id` — text, unique, not null (links to Clerk)
- `handle` — text, unique, not null (the URL slug)
- `full_name` — text, not null
- `specialty` — text
- `clinic_name` — text
- `clinic_location` — text
- `years_experience` — integer
- `profile_photo_url` — text
- `external_booking_url` — text
- `is_verified` — boolean, default false
- `verification_status` — text, default 'none' (none, pending, approved, rejected)
- `recommendation_count` — integer, default 0
- `connection_count` — integer, default 0
- `view_count` — integer, default 0
- `created_at` — timestamp with timezone, default now
- `updated_at` — timestamp with timezone, default now

**Table: connections**
- `id` — UUID, primary key
- `requester_id` — UUID, foreign key to profiles.id
- `receiver_id` — UUID, foreign key to profiles.id
- `status` — text (pending, accepted)
- `created_at` — timestamp

Add a unique constraint on (requester_id, receiver_id) to prevent duplicate connections.

**Table: invites**
- `id` — UUID, primary key
- `inviter_profile_id` — UUID, foreign key to profiles.id
- `invite_code` — text, unique
- `invitee_email` — text (optional)
- `used` — boolean, default false
- `used_by_profile_id` — UUID (optional, filled when invite is used)
- `created_at` — timestamp

**Table: recommendations**
- `id` — UUID, primary key
- `profile_id` — UUID, foreign key to profiles.id
- `fingerprint` — text (browser fingerprint for spam prevention)
- `ip_address` — text
- `created_at` — timestamp

Add a unique constraint on (profile_id, fingerprint) to prevent duplicate recommendations from same browser.

**Table: messages**
- `id` — UUID, primary key
- `profile_id` — UUID, foreign key to profiles.id (the doctor receiving)
- `sender_name` — text, not null
- `sender_phone` — text, not null
- `message_content` — text, not null
- `is_read` — boolean, default false
- `reply_content` — text (doctor's reply)
- `reply_sent_at` — timestamp
- `created_at` — timestamp

**Table: verification_documents**
- `id` — UUID, primary key
- `profile_id` — UUID, foreign key to profiles.id
- `document_url` — text, not null (private storage URL)
- `uploaded_at` — timestamp

**Table: profile_views**
- `id` — UUID, primary key
- `profile_id` — UUID, foreign key to profiles.id
- `viewer_ip` — text
- `viewed_at` — timestamp

### Step 2.3: Create Storage Buckets

In Supabase Storage, create two buckets:

1. `profile-photos` — set to PUBLIC
2. `verification-docs` — set to PRIVATE

### Step 2.4: Create Database Functions

Create a Postgres function called `increment_view_count` that takes a profile_id and increments the view_count column by 1.

Create a function called `increment_recommendation_count` that takes a profile_id and increments the recommendation_count column by 1.

### Step 2.5: Row Level Security

Enable Row Level Security on all tables. Create policies:
- Profiles: Anyone can read public profiles. Only the owner can update their own profile.
- Messages: Only the profile owner can read their messages.
- Verification documents: Only the profile owner and service role can access.
- Connections: Users can read connections where they are involved.

---

## Phase 3: Landing Page

### Step 3.1: Create the Homepage Layout

The homepage should have a clean, minimal layout with:
- A navigation bar with the logo (the verified badge SVG) and "Log In" button
- A hero section (the main focus)
- A features section below the fold
- A "How It Works" section
- A footer

### Step 3.2: Build the Hero Section

The hero section is the most important part. It should contain:

1. **Headline**: "Your Digital Identity. Verified." in large, bold typography.

2. **Subheadline**: "Claim your unique URL before another doctor does." in smaller, muted text.

3. **The URL Input Component**: This is the centerpiece.
   - A container styled to look like a browser URL bar
   - Static text on the left: `verified.doctor/`
   - An input field on the right where the user types their handle
   - A button that says "Check Availability"

4. **Typewriter Animation**: When the input is empty (not focused), show a typewriter animation in the placeholder that cycles through names. The names are: Anna, Arjun, Abdul, Chong, Priya, Dave, Fatima, Rohan, Mateo, Wei, Anjali, Kwame, Vikram, Sarah, Meera. The animation should type each name character by character, pause for 1.5 seconds, then backspace and type the next name. When the user clicks the input, the animation stops immediately.

5. **Availability Feedback**: When the user types and clicks "Check Availability" (or after a short debounce):
   - If available: Show a green checkmark and change the button to "Claim This Name"
   - If taken: Show red text "This name is taken" and suggest alternatives

6. **Social Proof**: Below the input, show text like "🔥 34 doctors joined today" (can be a static number for MVP, or pull from database later).

### Step 3.3: Build the Features Section

Three cards in a row showcasing:
1. **Verified Badge**: Icon of the badge. "Stand out with a verified credential that patients trust."
2. **Patient Recommendations**: Thumbs up icon. "Collect recommendations — no negative reviews, ever."
3. **Doctor Network**: Network icon. "Connect with peers and showcase your professional network."

### Step 3.4: Build the "How It Works" Section

Three steps with icons and brief descriptions:
1. Claim your URL
2. Build your profile (2 minutes)
3. Share your QR code

### Step 3.5: Create the Availability Check API

Create an API route at `/api/check-handle` that:
- Accepts a POST request with a `handle` in the body
- Validates the handle (3-30 chars, alphanumeric and hyphens only, not in banned list)
- Queries the database to check if the handle exists
- Returns `{ available: true/false }`

---

## Phase 4: Authentication & Claiming Flow

### Step 4.1: Set Up Clerk

Configure Clerk with email/password and Google sign-in options. Set up the sign-in and sign-up pages using Clerk's pre-built components at `/sign-in` and `/sign-up`.

### Step 4.2: Create the Claim Flow

When a user clicks "Claim This Name" from the homepage:
1. Store the desired handle in a cookie or URL parameter
2. Redirect to `/sign-up`
3. After successful signup, redirect to `/onboarding` with the handle

### Step 4.3: Build the Onboarding Page

The onboarding page (`/onboarding`) should:
1. Display the claimed handle prominently: "You're claiming verified.doctor/[handle]"
2. Show a form to collect:
   - Full Name (required)
   - Specialty (required, dropdown with common specialties)
   - Clinic Name (optional)
   - Clinic Location (optional)
   - Profile Photo (upload, with compression)
   - External Booking URL (optional)
3. Have a "Publish Profile" button

### Step 4.4: Handle Profile Photo Upload

When the user selects a photo:
1. Compress the image client-side to max 500KB and max 1200px dimension
2. Upload to the `profile-photos` Supabase bucket
3. Store the public URL in the form state

### Step 4.5: Create the Profile Creation API

Create an API route at `/api/profiles` that:
- Accepts a POST request with all profile fields
- Verifies the user is authenticated via Clerk
- Checks the handle is still available (race condition protection)
- Creates the profile in the database
- Returns the created profile

### Step 4.6: Post-Creation Redirect

After successful profile creation, redirect to `/dashboard` with a success toast: "Your profile is live at verified.doctor/[handle]!"

---

## Phase 5: Public Profile Page

### Step 5.1: Create the Dynamic Route

Create a dynamic route at `/[handle]/page.tsx` that renders the public profile.

### Step 5.2: Fetch Profile Data

On page load (server-side):
1. Query the database for the profile with the matching handle
2. If not found, show a 404 page with a CTA to claim this handle
3. If found, render the profile
4. Increment the view count (fire and forget, don't block render)

### Step 5.3: Build the Profile Header

Display:
- Profile photo (circular, large)
- Full name
- Verified badge (only if `is_verified` is true) — use the SVG logo
- Specialty and years experience
- Clinic name and location

### Step 5.4: Build the Metrics Section

Display two metrics cards:
- "Recommended by X Patients" — use the tiered display logic (hide if 0, show "patients" if 1-10, show "10+" if 11-50, etc.)
- "Connected with X Doctors" — always show if > 0

### Step 5.5: Build the Action Buttons

Three buttons, sticky at the bottom on mobile:

1. **Save Contact**: When clicked, generate and download a .vcf (vCard) file containing the doctor's name, specialty, clinic, phone (if available), and the profile URL.

2. **Send Inquiry**: Opens a dialog/modal with the messaging form (see Phase 7).

3. **Book Appointment**: If external_booking_url exists, this button links to it. Otherwise, hide this button.

### Step 5.6: Build the Recommendation Section

At the bottom of the profile:
- Text: "Did you visit Dr. [Name]?"
- A large, friendly button: "I Recommend This Doctor" with a thumbs-up icon
- When clicked, call the recommendation API

### Step 5.7: Create the Recommendation API

Create an API route at `/api/recommend` that:
- Accepts a POST with `profile_id`
- Captures the user's IP address and generates a simple browser fingerprint
- Checks if this fingerprint + profile combo exists (prevent duplicates)
- If new, create the recommendation record and increment the profile's recommendation_count
- Return success or "already recommended" message

---

## Phase 6: Doctor Dashboard

### Step 6.1: Create the Dashboard Layout

The dashboard at `/dashboard` should have:
- A sidebar or top navigation with tabs: Overview, Messages, Connections, Settings
- The main content area
- A header showing the doctor's name and a link to view their public profile

### Step 6.2: Build the Overview Tab

Display:
1. **Status Banner**: 
   - If not verified: A prominent banner with "Your profile is live but unverified. Upload documents to get your badge." and a "Get Verified" button.
   - If verified: A green banner with a checkmark and "You are a Verified Physician."

2. **Profile Completion Bar**: A progress indicator showing what's complete (photo, specialty, verification). Clicking incomplete items navigates to settings.

3. **Metrics Cards**: Four cards showing:
   - Profile Views (total)
   - Recommendations (total)
   - Connections (total)
   - Unread Messages (count)

4. **QR Code Section**: 
   - Display the QR code for their profile
   - "Download QR Code" button (PNG format)
   - "View Full Size" button

5. **Quick Actions**:
   - "Edit Profile" button
   - "Invite a Colleague" button
   - "View Public Profile" link

### Step 6.3: Build the Messages Tab

Display a list of all messages received, sorted by most recent first.

Each message card shows:
- Sender name
- Sender phone (partially masked for privacy in list view)
- Message preview (first 100 chars)
- Timestamp
- Read/Unread indicator

Clicking a message opens it in a detail view showing:
- Full message
- Sender's full phone number
- "Reply" button

### Step 6.4: Build the Reply Flow

When the doctor clicks "Reply":
1. Show a text area for the reply (max 500 characters)
2. Show a preview of how the SMS will look
3. "Send Reply" button
4. On send, call the SMS API to deliver the message

### Step 6.5: Create the Reply API

Create an API route at `/api/messages/[id]/reply` that:
- Accepts POST with reply content
- Verifies the message belongs to the authenticated doctor
- Calls MSG91 (or your SMS provider) to send the SMS
- Updates the message record with reply_content and reply_sent_at
- Returns success/failure

### Step 6.6: Build the Connections Tab

Two sections:

1. **Your Connections**: List of connected doctors with their photos, names, and specialties. Clicking one opens their public profile in a new tab.

2. **Pending Requests**: If any doctors have sent connection requests, show them here with Accept/Decline buttons.

3. **Invite a Colleague**: A prominent button that opens a dialog with:
   - Input field for email (optional)
   - A copyable invite link
   - "Send Invite" button (if email entered, sends invite email)

### Step 6.7: Create the Invite System

Create API routes:

`/api/invites` (POST): Creates a new invite code for the authenticated doctor.

`/api/invites/[code]` (GET): Validates an invite code and returns the inviter's info.

When a new doctor signs up with an invite code:
1. Create their profile
2. Automatically create a connection between them and the inviter
3. Increment both doctors' connection counts
4. Mark the invite as used

### Step 6.8: Build the Settings Tab

Sections:

1. **Edit Profile**: Form with all editable fields (name, specialty, photo, etc.)

2. **Verification**: 
   - If not verified: Upload section for documents (up to 3 images)
   - If pending: "Your verification is under review" message
   - If verified: "You are verified" with badge

3. **Account**: Link to Clerk's user profile for password changes, etc.

### Step 6.9: Create the Verification Upload API

Create an API route at `/api/verification` that:
- Accepts POST with up to 3 images
- Compresses images client-side before upload
- Uploads to the private `verification-docs` bucket
- Creates records in verification_documents table
- Updates profile's verification_status to 'pending'
- Optionally sends you (admin) an email notification

---

## Phase 7: Messaging System

### Step 7.1: Build the Message Form Component

A dialog/modal that appears when patients click "Send Inquiry" on a profile:
- Name input (required)
- Phone number input (required, with basic validation)
- Message textarea (required, max 500 characters, show character count)
- "Send Message" button
- Clear expectations text: "Dr. [Name] typically responds within 24-48 hours"

### Step 7.2: Create the Send Message API

Create an API route at `/api/messages` that:
- Accepts POST with profile_id, sender_name, sender_phone, message_content
- Validates all fields (phone format, message length)
- Rate limits by IP (max 5 messages per hour per IP)
- Creates the message record
- Optionally sends email notification to doctor about new message
- Returns success

### Step 7.3: Handle SMS Delivery

When doctor sends a reply:
1. Format the SMS: "Dr. [Name] replied: [message content]"
2. Call MSG91 API to send SMS to the patient's phone
3. Handle errors gracefully (invalid number, API failure)
4. Update message record with delivery status

---

## Phase 8: QR Code System

### Step 8.1: Create the QR Generation API

Create an API route at `/api/qr/[handle]` that:
- Takes the handle from the URL
- Generates a QR code for `https://verified.doctor/[handle]`
- Returns the QR code as a PNG image
- Caches the result (QR codes don't change)

### Step 8.2: QR Code in Dashboard

Display the QR code in the dashboard overview using an img tag pointing to the QR API endpoint. Add a download button that triggers a file download.

---

## Phase 9: Admin Panel

### Step 9.1: Simple Admin Approach

For MVP, use Supabase's built-in table editor to:
- View pending verifications
- Look at uploaded documents (via storage browser)
- Update verification_status to 'approved' or 'rejected'
- Update is_verified to true when approving

### Step 9.2: Future: Dedicated Admin Panel

If volume grows, build a simple admin page at `/admin` that:
- Is protected by checking if the Clerk user ID is in a hardcoded admin list
- Shows pending verifications with document previews
- Has Approve/Reject buttons
- Sends email notification to doctor on decision

---

## Phase 10: Polish & Launch Prep

### Step 10.1: Add Toast Notifications

Use shadcn's toast component to show feedback for:
- Profile saved
- Message sent
- Recommendation recorded
- Verification submitted
- Connection request sent/accepted

### Step 10.2: Add Loading States

Add skeleton loaders for:
- Dashboard metrics while fetching
- Profile page while loading
- Messages list

### Step 10.3: Add Error Handling

Ensure all API routes return proper error messages. Display user-friendly error states in the UI.

### Step 10.4: Add Meta Tags

For public profile pages, add dynamic meta tags:
- Title: "Dr. [Name] | Verified.Doctor"
- Description: "[Specialty] at [Clinic]"
- Open Graph image (can be a simple card with their name and badge)

### Step 10.5: Set Up Domain

In Vercel:
1. Add `verified.doctor` as a custom domain
2. Configure DNS at your registrar
3. Wait for SSL certificate provisioning

### Step 10.6: Test End-to-End

Test the complete flows:
1. New user claims handle → signs up → creates profile → views public page
2. Patient visits profile → saves contact → sends message
3. Doctor receives message → replies → patient gets SMS
4. Doctor invites colleague → colleague signs up → auto-connected
5. Patient recommends doctor → count increases
6. Doctor uploads verification docs → admin approves → badge appears

---

## Build Order Summary

**Week 1:**
1. Project setup and database schema
2. Landing page with FOMO hero
3. Authentication with Clerk
4. Onboarding flow
5. Profile creation API

**Week 2:**
6. Public profile page
7. Recommendation system
8. QR code generation
9. Dashboard overview
10. Basic settings

**Week 3:**
11. Messaging system (patient → doctor)
12. Reply system with SMS (doctor → patient)
13. Connections and invite system
14. Verification upload flow

**Week 4:**
15. Polish, error handling, loading states
16. Meta tags and SEO
17. Testing all flows
18. Deploy and launch

---

## Handoff Notes for AI Coding Assistants

When using this document with Cursor, Claude, or other AI coding tools:

1. Feed the PRD.md first for context
2. Feed the TECHSTACK.md for tech decisions
3. Feed this IMPLEMENTATION.md for step-by-step guidance
4. Feed the DESIGN.md for visual/styling guidelines

For each step, ask the AI to implement that specific piece. Be specific about which step you're on. Example prompt: "We're on Step 5.3 of the implementation guide. Build the Profile Header component according to the design spec."

The documents are designed to give the AI all the context it needs without ambiguity.
