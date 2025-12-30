# Verified.doctor — Design System

## Design Philosophy

**Premium Medical Aesthetic.** Think Apple's health products meet LinkedIn's professionalism. Clean, trustworthy, aspirational.

**Key Principles:**
1. **Trust through whitespace** — Let the content breathe. Cluttered = untrustworthy in medicine.
2. **Status through restraint** — Minimal decoration. The badge does the talking.
3. **Confidence through simplicity** — Clear hierarchy, obvious actions.

---

## Brand Colors

### Primary Palette

| Name | Hex | Usage |
|------|-----|-------|
| **Verified Blue** | `#0099F7` | Primary brand color, CTAs, links, the badge gradient start |
| **Verified Deep Blue** | `#0080CC` | Badge gradient end, hover states |
| **Verified Cyan** | `#A4FDFF` | Accent color (from badge checkmark), highlights |

### Neutral Palette

| Name | Hex | Usage |
|------|-----|-------|
| **White** | `#FFFFFF` | Backgrounds, cards |
| **Slate 50** | `#F8FAFC` | Page backgrounds, subtle sections |
| **Slate 100** | `#F1F5F9` | Borders, dividers |
| **Slate 200** | `#E2E8F0` | Input borders, card borders |
| **Slate 400** | `#94A3B8` | Placeholder text, secondary icons |
| **Slate 600** | `#475569` | Body text |
| **Slate 800** | `#1E293B` | Headings, primary text |
| **Slate 900** | `#0F172A` | Strongest text, doctor names |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Success Green** | `#10B981` | Available handles, success states |
| **Error Red** | `#EF4444` | Taken handles, errors |
| **Warning Amber** | `#F59E0B` | Pending states, alerts |

### Tailwind Config

These map to Tailwind's slate scale. Extend with custom brand colors:

```
primary: #0099F7
primary-dark: #0080CC
accent: #A4FDFF
```

---

## Typography

### Font Family

**Primary:** Inter (Google Fonts)
- Clean, professional, excellent readability
- Widely used in premium SaaS products

**Fallback:** system-ui, -apple-system, sans-serif

### Type Scale

| Element | Size | Weight | Line Height | Letter Spacing |
|---------|------|--------|-------------|----------------|
| **H1 (Hero)** | 48px / 3rem | 700 (Bold) | 1.1 | -0.02em |
| **H2 (Section)** | 32px / 2rem | 600 (Semibold) | 1.2 | -0.01em |
| **H3 (Card Title)** | 24px / 1.5rem | 600 (Semibold) | 1.3 | 0 |
| **H4 (Subsection)** | 20px / 1.25rem | 600 (Semibold) | 1.4 | 0 |
| **Body Large** | 18px / 1.125rem | 400 (Regular) | 1.6 | 0 |
| **Body** | 16px / 1rem | 400 (Regular) | 1.5 | 0 |
| **Body Small** | 14px / 0.875rem | 400 (Regular) | 1.5 | 0 |
| **Caption** | 12px / 0.75rem | 500 (Medium) | 1.4 | 0.02em |

### Mobile Adjustments

- H1 scales down to 36px on mobile
- H2 scales down to 24px on mobile
- Body remains 16px (optimal for mobile readability)

---

## The Verified Badge

### Usage

The badge is the single most important visual element. It communicates trust instantly.

### Placement Rules

1. **Profile Header:** Badge appears immediately after the doctor's name, vertically centered.
2. **Size:** On profile pages, badge is 32px × 32px. In lists/cards, 24px × 24px.
3. **Spacing:** 8px gap between name and badge.
4. **Never:** Stretch, distort, recolor, or add effects to the badge.

### States

| State | Visual |
|-------|--------|
| **Verified** | Full-color badge (gradient blue with cyan checkmark) |
| **Unverified** | No badge shown (not a grayed-out badge — just absent) |
| **Pending** | Small text "Verification pending" in slate-400, no badge |

### The Badge SVG

Use the provided `verified-doctor-logo.svg` file. Key attributes:
- Gradient background: #0099F7 to #0080CC (diagonal)
- Checkmark color: #A4FDFF
- Shape: Stylized medical cross/plus with rounded corners

---

## Spacing System

Use Tailwind's default spacing scale (based on 4px increments).

### Common Patterns

| Context | Spacing |
|---------|---------|
| Page padding (mobile) | 16px (p-4) |
| Page padding (desktop) | 24px or 32px (p-6 or p-8) |
| Section gap | 64px (gap-16) or 80px (gap-20) |
| Card padding | 24px (p-6) |
| Between form fields | 16px (space-y-4) |
| Button padding | 12px vertical, 24px horizontal (py-3 px-6) |

---

## Components

### Buttons

**Primary Button (CTAs)**
- Background: Verified Blue (#0099F7)
- Text: White
- Padding: 12px 24px
- Border radius: 8px (rounded-lg)
- Font: 16px, Semibold (600)
- Hover: Darken to #0080CC
- Transition: 150ms ease

**Secondary Button**
- Background: White
- Border: 1px Slate 200
- Text: Slate 800
- Hover: Background Slate 50

**Ghost Button**
- Background: Transparent
- Text: Verified Blue
- Hover: Background Blue 50

**Button Sizes**
- Large: py-4 px-8, text-lg (for hero CTAs)
- Default: py-3 px-6, text-base
- Small: py-2 px-4, text-sm

### Cards

**Standard Card**
- Background: White
- Border: 1px Slate 200
- Border radius: 12px (rounded-xl)
- Shadow: shadow-sm (subtle)
- Padding: 24px

**Elevated Card (for important items)**
- Same as standard
- Shadow: shadow-md
- Hover: shadow-lg with slight translateY(-2px)

**Metric Card (Dashboard)**
- Same as standard
- Icon in top-left (24px, Slate 400)
- Large number (32px, Bold, Slate 900)
- Label below (14px, Slate 600)

### Inputs

**Text Input**
- Height: 48px
- Border: 1px Slate 200
- Border radius: 8px
- Padding: 0 16px
- Font: 16px
- Focus: Border Verified Blue, ring-2 ring-blue-100
- Placeholder: Slate 400

**The Hero URL Input**
- Special component
- Left side: Static text "verified.doctor/" in Slate 600, background Slate 50
- Right side: Input field with typewriter animation
- Combined border radius: 12px
- Height: 56px (larger for prominence)
- Shadow: shadow-md to lift it off the page

### Avatars

**Profile Photo**
- Shape: Circle
- Sizes: 
  - Large (profile page): 128px
  - Medium (cards): 64px
  - Small (lists): 40px
- Border: 2px White (to create separation on colored backgrounds)
- Fallback: Initials on gradient background

### Badges (UI, not the Verified badge)

**Metric Badges**
- "Recommended by 50+ patients"
- Background: Blue 50 (#EFF6FF)
- Text: Blue 700 (#1D4ED8)
- Padding: 4px 12px
- Border radius: 9999px (pill shape)
- Font: 14px, Medium

**Status Badges**
- Verified: Green 50 bg, Green 700 text
- Pending: Amber 50 bg, Amber 700 text
- Unverified: Slate 100 bg, Slate 600 text

---

## Page Layouts

### Landing Page

```
┌─────────────────────────────────────────────────────────────┐
│  Nav: Logo (left)              [Log In] button (right)      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│            Your Digital Identity. Verified.                 │
│                                                             │
│       Claim your unique URL before another doctor does.     │
│                                                             │
│     ┌─────────────────────────────────────────────────┐     │
│     │ verified.doctor/ │  [arjun_]  │ [Check]         │     │
│     └─────────────────────────────────────────────────┘     │
│                                                             │
│            🔥 34 doctors joined today                       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   [Feature Card 1]  [Feature Card 2]  [Feature Card 3]      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   How It Works: [Step 1] → [Step 2] → [Step 3]              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  Footer                                                     │
└─────────────────────────────────────────────────────────────┘
```

**Hero Section Details:**
- Centered content
- Max width: 600px for text, input can be wider
- Background: White or very subtle gradient (white to Slate 50)
- Generous vertical padding: 120px top, 80px bottom

### Public Profile Page

```
┌─────────────────────────────────────────────────────────────┐
│  Nav: Logo (left)              [Claim Yours] button (right) │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│        ┌──────────┐                                         │
│        │  Photo   │                                         │
│        │  128px   │                                         │
│        └──────────┘                                         │
│                                                             │
│        Dr. Arjun Sharma  [✓ Badge]                          │
│        Cardiologist • 12 Years Experience                   │
│        HeartCare Clinic, Mumbai                             │
│                                                             │
│    ┌─────────────────┐  ┌─────────────────┐                 │
│    │ 👍 Recommended  │  │ 🔗 Connected    │                 │
│    │ by 50+ patients │  │ with 24 doctors │                 │
│    └─────────────────┘  └─────────────────┘                 │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│        Did you visit Dr. Sharma?                            │
│                                                             │
│        [ 👍 I Recommend This Doctor ]                       │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ [Save Contact]  [Send Inquiry]  [Book Appointment]    │  │
│  └───────────────────────────────────────────────────────┘  │
│  (Sticky on mobile)                                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Profile Page Details:**
- Single column, centered (max-width: 480px)
- Profile photo should have a subtle shadow
- Generous whitespace between sections
- Action buttons are full-width on mobile, centered row on desktop

### Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│  Logo          Dr. Arjun Sharma          [View Profile]     │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────┐                                                 │
│ │Overview │ Messages (3) │ Connections │ Settings           │
│ └─────────┘                                                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ ⚠️ Your profile is live but unverified.             │    │
│  │    Upload documents to get your badge. [Get Verified]│    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │  Views   │ │  Recs    │ │  Conns   │ │ Messages │       │
│  │  1,205   │ │   142    │ │    24    │ │    3     │       │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘       │
│                                                             │
│  ┌──────────────────────┐  ┌──────────────────────────┐    │
│  │      QR Code         │  │    Quick Actions         │    │
│  │      [Image]         │  │    [Edit Profile]        │    │
│  │   [Download QR]      │  │    [Invite Colleague]    │    │
│  └──────────────────────┘  └──────────────────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Dashboard Details:**
- Tab navigation (not sidebar) to save horizontal space
- Metric cards in a 4-column grid on desktop, 2x2 on mobile
- Unverified banner is prominent but not alarming (amber, not red)

---

## Animations & Interactions

### The Typewriter Effect (Hero)

- Typing speed: 100ms per character
- Pause after complete word: 1500ms
- Backspace speed: 50ms per character
- Cursor: Blinking pipe character, blink rate 500ms

### Page Transitions

- Use Framer Motion for route transitions
- Fade in: 300ms ease-out
- Keep it subtle — this is a professional tool, not a creative portfolio

### Hover States

- Buttons: Background color shift, 150ms transition
- Cards: Subtle lift (translateY -2px) with shadow increase
- Links: Color change, no underline (except in body text)

### Loading States

- Use skeleton loaders (shadcn Skeleton component)
- Match the shape of the content being loaded
- Subtle shimmer animation

### Success/Error Feedback

- Toast notifications in top-right corner
- Success: Green left border
- Error: Red left border
- Auto-dismiss after 4 seconds
- Slide in from right

---

## Mobile Considerations

### Breakpoints

| Name | Width | Usage |
|------|-------|-------|
| sm | 640px | Small tablets, large phones landscape |
| md | 768px | Tablets |
| lg | 1024px | Small laptops |
| xl | 1280px | Desktops |

### Mobile-First Patterns

1. **Profile Action Buttons:** Sticky at bottom of screen, full-width, 64px height each
2. **Navigation:** Hamburger menu for dashboard, but landing page can keep simple top nav
3. **Cards:** Stack vertically with full width
4. **Input Fields:** Full width, minimum 48px height for touch targets
5. **Modal/Dialogs:** Full-screen on mobile (not floating)

---

## Iconography

### Icon Set

Use **Lucide Icons** (already integrated with shadcn/ui).

### Common Icons

| Concept | Icon Name |
|---------|-----------|
| Views | `Eye` |
| Recommendations | `ThumbsUp` |
| Connections | `Users` |
| Messages | `MessageSquare` |
| QR Code | `QrCode` |
| Settings | `Settings` |
| Edit | `Pencil` |
| External Link | `ExternalLink` |
| Phone | `Phone` |
| Location | `MapPin` |
| Calendar | `Calendar` |
| Check | `Check` |
| Close | `X` |
| Menu | `Menu` |
| Copy | `Copy` |
| Download | `Download` |
| Send | `Send` |

### Icon Styling

- Size: 20px (default), 16px (small), 24px (large)
- Color: Slate 400 (secondary), Slate 600 (primary), Verified Blue (interactive)
- Stroke width: 2px (Lucide default)

---

## Image Guidelines

### Profile Photos

- Aspect ratio: 1:1 (square)
- Minimum upload size: 400×400px
- Storage size: Compressed to <500KB
- Display: Always circular crop
- Fallback: Initials on gradient background (blue to cyan)

### Verification Documents

- Not displayed publicly
- Stored at reasonable quality for manual review
- Compressed to <500KB per image
- Accepted formats: JPG, PNG

### Open Graph Image

For social sharing of profile pages:
- Size: 1200×630px
- Content: Doctor's name, specialty, and the Verified badge on a clean background
- Generate dynamically or use a template

---

## Do's and Don'ts

### Do

- Use plenty of whitespace
- Keep the badge prominent
- Use the blue gradient sparingly (it's the "hero" color)
- Maintain high contrast for readability
- Test on actual mobile devices

### Don't

- Add decorative elements (shapes, patterns, illustrations)
- Use more than 2-3 colors on any screen
- Make the UI feel "fun" or "playful" — this is professional
- Use stock photos of doctors (this isn't a hospital website)
- Add shadows to everything — only use for elevation hierarchy
- Use red for anything except errors (no red badges, buttons, etc.)

---

## Accessibility

### Color Contrast

- All text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- Don't rely on color alone to convey information (add icons or text)

### Focus States

- All interactive elements have visible focus rings
- Use `focus-visible` to avoid showing focus on click
- Focus ring: 2px Verified Blue, offset 2px

### Screen Readers

- All images have alt text
- Icon-only buttons have aria-labels
- Form inputs have associated labels
- Use semantic HTML (buttons, headings, landmarks)

### Motion

- Respect `prefers-reduced-motion` — disable animations for users who prefer it

---

## File Assets

### Required Assets

1. `verified-doctor-logo.svg` — The main badge/logo (provided)
2. `favicon.ico` — 32×32 version of the badge
3. `apple-touch-icon.png` — 180×180 for iOS
4. `og-image-template.png` — Open Graph template

### Font Loading

Load Inter from Google Fonts with weights: 400, 500, 600, 700.

Use `font-display: swap` for performance.

---

## Example Color Application

### Landing Page Hero

- Background: White
- Headline: Slate 900
- Subheadline: Slate 600
- Input container: White with Slate 200 border
- Input prefix "verified.doctor/": Slate 600 on Slate 50 background
- Button: Verified Blue background, white text
- Social proof: Slate 500

### Profile Page

- Background: Slate 50
- Card background: White
- Name: Slate 900
- Specialty: Slate 600
- Metric badges: Blue 50 background, Blue 700 text
- Action buttons: Verified Blue (primary), White with border (secondary)

### Dashboard

- Background: White
- Sidebar/Tabs: Slate 50 active, white inactive
- Metric card numbers: Slate 900
- Metric card labels: Slate 600
- Warning banner: Amber 50 background, Amber 900 text
- Success banner: Green 50 background, Green 900 text
