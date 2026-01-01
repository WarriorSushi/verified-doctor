<p align="center">
  <img src="public/verified-doctor-logo.svg" width="120" alt="Verified.Doctor Logo" />
</p>

<h1 align="center">Verified.Doctor</h1>

<p align="center">
  <strong>The Blue Checkmark for Medical Professionals</strong>
</p>

<p align="center">
  A premium Digital Identity and Reputation platform for doctors.
  <br />
  Think LinkedIn meets Linktree — built specifically for healthcare.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#demo">Demo</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#contributing">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwindcss" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Supabase-Database-3ecf8e?style=flat-square&logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</p>

---

## Why Verified.Doctor?

Doctors face unique challenges online:

- **No control over reputation** — Anyone can leave fake negative reviews on Google
- **Scattered digital presence** — Profiles spread across Practo, Google, hospital sites
- **Privacy concerns** — Sharing personal WhatsApp with patients
- **Generic solutions** — LinkedIn and Linktree aren't built for healthcare

**Verified.Doctor solves this** with a premium, verified digital identity that doctors control.

---

## Features

### For Doctors

| Feature | Description |
|---------|-------------|
| **Vanity URL** | Claim `verified.doctor/yourname` — a memorable, professional URL |
| **Verified Badge** | Stand out with a verified credential that patients trust |
| **Recommendations Only** | No negative reviews. Patients can only recommend, not criticize |
| **Professional Messaging** | Receive patient inquiries without sharing personal contact |
| **Peer Network** | Connect with colleagues and showcase your professional network |
| **QR Code** | Share your profile instantly — perfect for clinics and business cards |
| **Beautiful Templates** | Choose from 4 professionally designed profile themes |
| **Analytics Dashboard** | Track profile views, recommendations, and engagement |

### For Patients

- **Verify credentials** at a glance with the trusted badge
- **Save contact** directly to phone with one tap
- **Send inquiries** without knowing doctor's personal number
- **See social proof** — recommendations and peer connections

---

## Demo

> **Live Demo:** Coming soon at [verified.doctor](https://verified.doctor)

### Screenshots

<details>
<summary>View Screenshots</summary>

**Landing Page**
- FOMO-driven hero with real-time handle availability check
- Typewriter animation cycling through doctor names

**Public Profile**
- Clean, professional design with verified badge
- One-tap contact save and messaging

**Dashboard**
- Profile analytics and engagement metrics
- Message management and reply system

</details>

---

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Supabase account (free tier works)

### Installation

```bash
# Clone the repository
git clone https://github.com/WarriorSushi/verified-doctor.git
cd verified-doctor

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

See [`.env.example`](.env.example) for all required and optional environment variables.

---

## Tech Stack

| Layer | Technology | Why |
|-------|------------|-----|
| **Framework** | [Next.js 15](https://nextjs.org) | App Router, RSC, API routes |
| **Language** | [TypeScript](https://typescriptlang.org) | Type safety, better DX |
| **Styling** | [Tailwind CSS](https://tailwindcss.com) | Utility-first, rapid development |
| **Components** | [shadcn/ui](https://ui.shadcn.com) | Beautiful, accessible components |
| **Animation** | [Framer Motion](https://framer.com/motion) | Smooth, performant animations |
| **Database** | [Supabase](https://supabase.com) | Postgres + Auth + Storage |
| **Email** | [Resend](https://resend.com) | Developer-friendly transactional email |
| **Rate Limiting** | [Upstash](https://upstash.com) | Serverless Redis |
| **Deployment** | [Vercel](https://vercel.com) | Zero-config Next.js hosting |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication routes
│   ├── (dashboard)/       # Protected dashboard
│   ├── admin/             # Admin panel
│   ├── api/               # API routes
│   └── [handle]/          # Public profile pages
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── dashboard/         # Dashboard components
│   ├── landing/           # Landing page sections
│   └── profile/           # Profile templates
├── lib/
│   ├── supabase/          # Database client
│   ├── email/             # Email utilities
│   └── utils.ts           # Shared utilities
└── hooks/                 # Custom React hooks
```

---

## Database Schema

<details>
<summary>View Schema</summary>

### profiles
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| user_id | uuid | Supabase Auth user ID |
| handle | text | Unique URL slug |
| full_name | text | Doctor's name |
| specialty | text | Medical specialty |
| is_verified | boolean | Verification status |
| recommendation_count | int | Total recommendations |
| connection_count | int | Peer connections |
| view_count | int | Profile views |

### connections
| Column | Type | Description |
|--------|------|-------------|
| requester_id | uuid | Doctor sending request |
| receiver_id | uuid | Doctor receiving request |
| status | text | pending / accepted |

### messages
| Column | Type | Description |
|--------|------|-------------|
| profile_id | uuid | Receiving doctor |
| sender_name | text | Patient name |
| sender_phone | text | Patient phone |
| message_content | text | Inquiry message |

</details>

---

## Deployment

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/WarriorSushi/verified-doctor)

1. Click the button above
2. Connect your GitHub account
3. Add environment variables
4. Deploy!

### Manual Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

---

## Roadmap

- [x] Core profile system
- [x] Verification workflow
- [x] Recommendations engine
- [x] Peer connections
- [x] Messaging system
- [x] Admin panel
- [x] Email notifications
- [ ] SMS replies (MSG91)
- [ ] Mobile app (React Native)
- [ ] Doctor directory search
- [ ] Premium tiers
- [ ] API for hospitals

---

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Security

Found a security vulnerability? Please read our [Security Policy](SECURITY.md) and report it responsibly.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com) for the beautiful component library
- [Supabase](https://supabase.com) for the backend infrastructure
- [Vercel](https://vercel.com) for hosting

---

<p align="center">
  <sub>Built with care for the medical community</sub>
</p>

<p align="center">
  <a href="https://verified.doctor">Website</a> •
  <a href="https://twitter.com/verifieddoctor">Twitter</a> •
  <a href="mailto:hello@verified.doctor">Contact</a>
</p>
