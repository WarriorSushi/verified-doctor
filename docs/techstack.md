# Verified.doctor — Technical Stack

## Overview

This document outlines the recommended technical stack for building Verified.doctor. The stack is optimized for:
- Solo developer velocity
- Low operational overhead
- Cost efficiency at early stage
- Scalability when needed

---

## Core Framework

### Next.js 14+ (App Router)

**Why Next.js:**
- Server-side rendering for SEO (critical for `verified.doctor/handle` pages to rank)
- API routes built-in (no separate backend needed)
- File-based routing matches our URL structure perfectly
- React Server Components for performance
- Vercel deployment is one-click

**Version:** Use the latest stable (14.x or 15.x)

**Key Configuration:**
- App Router (not Pages Router)
- TypeScript enabled
- Tailwind CSS integrated

---

## UI & Styling

### Tailwind CSS

**Why Tailwind:**
- Rapid prototyping
- Consistent design system
- No context switching between files
- Excellent documentation

### shadcn/ui

**Why shadcn/ui:**
- Not a component library — it's copy-paste components you own
- Built on Radix UI primitives (accessible, tested)
- Tailwind-native styling
- Easily customizable to match brand

**Components You'll Need:**
- `Button` — primary actions
- `Input` — forms, the hero URL input
- `Card` — dashboard metrics, profile sections
- `Dialog` — modals for messaging, invites
- `Avatar` — profile photos
- `Badge` — verification status, connection counts
- `Form` — with react-hook-form integration
- `Tabs` — dashboard navigation
- `Toast` — notifications
- `Skeleton` — loading states

### Framer Motion

**Why Framer Motion:**
- The typewriter animation in hero section
- Page transitions
- Micro-interactions (button hovers, card appearances)
- Smooth, performant animations

---

## Database

### PostgreSQL via Supabase

**Why Supabase:**
- Managed Postgres (no DevOps)
- Built-in auth (optional, but available)
- Real-time subscriptions (for future live features)
- Storage for images included
- Generous free tier (500MB database, 1GB storage)
- Row Level Security for data protection

**Why Postgres over others:**
- Relational data (users, connections, messages) fits SQL perfectly
- Complex queries for analytics later
- JSONB columns for flexible schema when needed
- Full-text search built-in (for future directory)

### Alternative: Neon

If you prefer serverless Postgres with better cold-start times, Neon is excellent. Similar pricing, slightly better DX for serverless.

---

## Authentication

### Clerk

**Why Clerk:**
- Pre-built UI components (sign up, sign in, user profile)
- Social logins ready (Google, which doctors use)
- Session management handled
- Webhook support for user events
- Generous free tier (10,000 MAUs)

**Integration:**
- Use Clerk's Next.js SDK
- Middleware for protected routes
- User metadata for storing `handle`, `is_verified`, etc.

### Alternative: NextAuth.js (Auth.js)

If you want more control and lower cost at scale, NextAuth with credentials + Google provider works well. More setup, more flexibility.

### Alternative: Supabase Auth

If you're already using Supabase for database, their auth is decent and keeps everything in one place. Less polished UI than Clerk.

---

## File Storage

### Supabase Storage

**Why:**
- Already using Supabase for database
- Simple API
- Private buckets for verification documents
- Public buckets for profile photos
- Automatic CDN

**Buckets to Create:**
1. `profile-photos` — public, for user avatars
2. `verification-docs` — private, for ID uploads

### Alternative: AWS S3 + CloudFront

More control, slightly cheaper at scale, but more setup. Use if you hit Supabase storage limits.

### Alternative: Cloudflare R2

Zero egress fees. Great if you expect high traffic to images. Compatible with S3 API.

---

## Image Processing

### Client-Side Compression

**Library:** `browser-image-compression`

**Why:**
- Compress images before upload (target: <500KB)
- Reduces storage costs
- Faster uploads for users on slow connections
- No server processing needed

**Usage:**
```
Before upload: Compress to max 500KB, max dimension 1200px
```

### Server-Side (Optional)

If you need more control (thumbnails, format conversion), use:
- **Sharp** — fast Node.js image processing
- Or **Cloudflare Images** — managed service

---

## SMS/Messaging

### MSG91 (India-focused)

**Why MSG91:**
- Best rates for Indian SMS (~₹0.15/SMS)
- Reliable delivery
- Simple API
- Good documentation

**Use Case:** Sending doctor's reply to patient's phone number

### Alternative: Twilio

Better for international, more expensive for India. Use if you expand globally.

### Alternative: Gupshup

Another solid India option with WhatsApp Business API support for future.

---

## Email

### Resend

**Why Resend:**
- Developer-friendly API
- React Email for templates
- Generous free tier (3,000 emails/month)
- Great deliverability

**Use Cases:**
- Welcome email on signup
- Verification approved/rejected notification
- New message notification (optional)
- Invite colleague emails

### Alternative: Postmark

Excellent deliverability, slightly higher cost.

### Alternative: AWS SES

Cheapest at scale, more setup required.

---

## QR Code Generation

### Library: `qrcode` (npm)

**Why:**
- Simple, lightweight
- Works in Node.js and browser
- Customizable colors (for future Pro feature)
- SVG or PNG output

**Generation:**
- Generate on profile creation
- Store as SVG in database or generate on-demand
- Serve from `/api/qr/[handle]` endpoint

---

## Analytics

### Phase 1: Simple (Built-in)

Store in your own database:
- Profile views (increment counter)
- Recommendation events
- Message counts

### Phase 2: Proper Analytics

**Plausible Analytics**
- Privacy-friendly
- Simple dashboard
- EU-hosted option
- ~$9/month

**Alternative: PostHog**
- More features (funnels, session replay)
- Self-hostable
- Generous free tier

**Alternative: Vercel Analytics**
- If deployed on Vercel, it's integrated
- Simple, but limited

---

## Hosting & Deployment

### Vercel

**Why Vercel:**
- Made for Next.js (literally)
- Zero-config deployment
- Automatic preview deployments
- Edge functions for global performance
- Generous free tier

**Domain Setup:**
- Add `verified.doctor` as custom domain
- Automatic SSL
- Configure wildcard for dynamic routes

### Alternative: Cloudflare Pages

Faster edge network, but less Next.js-specific features. Good if you're cost-sensitive at scale.

### Alternative: Railway

Better for full-stack apps with background jobs. Slightly more complex.

---

## Development Tools

### TypeScript

**Why:**
- Catch errors at compile time
- Better IDE support
- Self-documenting code
- Essential for any serious project

### ESLint + Prettier

**Why:**
- Consistent code style
- Catch common mistakes
- Auto-format on save

### pnpm

**Why:**
- Faster than npm
- Disk space efficient
- Better monorepo support (if needed later)

---

## Testing (Phase 2)

### Vitest

Unit testing for utility functions, API routes.

### Playwright

End-to-end testing for critical flows:
- Signup flow
- Profile creation
- Recommendation submission

---

## Monitoring & Error Tracking

### Sentry

**Why:**
- Catch errors in production
- Stack traces with context
- Performance monitoring
- Generous free tier

---

## Rate Limiting

### Upstash Redis

**Why:**
- Serverless Redis
- Perfect for rate limiting APIs
- Edge-compatible
- Pay per request

**Use Cases:**
- Limit recommendation submissions per IP
- Limit message sends per patient
- Prevent brute force on login

### Alternative: Vercel KV

If on Vercel, their KV is Upstash under the hood. Slightly easier setup.

---

## Background Jobs (Future)

### Trigger.dev or Inngest

**When Needed:**
- Sending batch emails
- Processing verification queue
- Generating analytics reports

**For MVP:** Not needed. Use Next.js API routes for everything.

---

## Local Development

### Database: Supabase Local (Docker)

Run Supabase locally for development without hitting production.

### Environment Variables

Use `.env.local` for:
- Database URL
- Clerk keys
- MSG91 API key
- Resend API key

---

## Cost Estimate (MVP Phase)

| Service | Monthly Cost |
|---------|--------------|
| Vercel (Hobby) | $0 |
| Supabase (Free) | $0 |
| Clerk (Free tier) | $0 |
| Resend (Free tier) | $0 |
| MSG91 | ~₹500 ($6) for 3,000 SMS |
| Domain (verified.doctor) | Already owned |
| **Total** | **~$6/month** |

### At Scale (10,000 users)

| Service | Monthly Cost |
|---------|--------------|
| Vercel Pro | $20 |
| Supabase Pro | $25 |
| Clerk (10k MAU) | $0 (free tier) |
| Resend | $20 |
| MSG91 | ~$50 |
| Upstash | $10 |
| Sentry | $0 (free tier) |
| **Total** | **~$125/month** |

---

## Stack Summary

```
┌─────────────────────────────────────────────────────┐
│                    FRONTEND                         │
├─────────────────────────────────────────────────────┤
│  Next.js 14+ (App Router)                          │
│  TypeScript                                         │
│  Tailwind CSS + shadcn/ui                          │
│  Framer Motion (animations)                         │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                    BACKEND                          │
├─────────────────────────────────────────────────────┤
│  Next.js API Routes                                 │
│  Clerk (Authentication)                             │
│  Supabase (Database + Storage)                      │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                   SERVICES                          │
├─────────────────────────────────────────────────────┤
│  MSG91 (SMS)                                        │
│  Resend (Email)                                     │
│  Upstash (Rate Limiting)                            │
│  Sentry (Error Tracking)                            │
└─────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────┐
│                   HOSTING                           │
├─────────────────────────────────────────────────────┤
│  Vercel (Frontend + API)                            │
│  Supabase Cloud (Database)                          │
└─────────────────────────────────────────────────────┘
```

---

## Quick Start Commands

```bash
# Create Next.js app with TypeScript and Tailwind
pnpm create next-app@latest verified-doctor --typescript --tailwind --app

# Add shadcn/ui
pnpm dlx shadcn-ui@latest init

# Add essential dependencies
pnpm add @clerk/nextjs @supabase/supabase-js framer-motion qrcode browser-image-compression

# Add dev dependencies
pnpm add -D @types/qrcode
```
