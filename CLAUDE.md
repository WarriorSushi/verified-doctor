# Verified.Doctor

A SaaS platform providing doctors with premium Digital Identity and Reputation management - the "Blue Checkmark for Medical Professionals."

## Quick Reference

```bash
# Development
pnpm dev          # Start dev server
pnpm build        # Production build
pnpm lint         # Run ESLint
pnpm test         # Run tests

# Database
pnpm db:generate  # Generate types from Supabase
pnpm db:migrate   # Run migrations
```

## Documentation

- @docs/prd.md - Full product requirements and user journeys
- @docs/techstack.md - Technology stack decisions and rationale
- @docs/implementation.md - Step-by-step build guide
- @docs/design-system.md - Colors, typography, components, layouts

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14+ (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS + shadcn/ui |
| Animation | Framer Motion |
| Auth | Clerk |
| Database | PostgreSQL via Supabase |
| Storage | Supabase Storage |
| SMS | MSG91 |
| Email | Resend |
| Rate Limiting | Upstash Redis |
| Hosting | Vercel |

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes (sign-in, sign-up)
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── [handle]/          # Public profile pages
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/
│   ├── ui/                # shadcn/ui components
│   └── ...                # Feature components
├── lib/
│   ├── supabase/          # Supabase client & queries
│   ├── clerk/             # Clerk utilities
│   └── utils.ts           # Shared utilities
├── hooks/                 # Custom React hooks
└── types/                 # TypeScript types
```

## Key Patterns

### API Routes
- All API routes in `src/app/api/`
- Use Zod for request validation
- Return consistent error format: `{ error: string, code?: string }`
- Protected routes check Clerk auth first

### Database
- Use Supabase client from `lib/supabase/client.ts`
- Server components use `createServerClient`
- Client components use `createBrowserClient`
- Always use Row Level Security policies

### Components
- Use shadcn/ui as base components
- Keep components small and focused
- Co-locate component-specific types

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
MSG91_API_KEY=
RESEND_API_KEY=
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## Important Conventions

1. **No negative reviews** - Only positive recommendations, displayed in tiers
2. **Handle format** - 3-30 chars, alphanumeric + hyphens, lowercase
3. **Image compression** - Always compress to <500KB client-side before upload
4. **Verified badge** - Only shown when `is_verified === true`
5. **SMS replies** - Doctor's personal number never exposed to patients

## MCP Plugins Usage

### Supabase MCP (Disabled by Default)
**IMPORTANT:** Supabase MCP is disabled to save context. Before database operations, tell the user:
> "I need to use Supabase MCP. Please enable it by running `/mcp` and connecting to Supabase."

Use for: Creating tables, migrations, executing SQL, generating types, checking security advisors.

### Playwright MCP (UI Testing)
Use proactively for:
- Testing user flows after implementing features
- Verifying UI renders correctly
- Debugging visual issues

Prefer `browser_snapshot` over `browser_take_screenshot` for interactions.
Always `browser_close` when done.

### Context7 MCP (Documentation)
Use when looking up:
- Latest Next.js/React patterns
- Clerk authentication methods
- Supabase client usage
- Any library API you're unsure about

### Frontend Design Plugin
Use the Skill tool with `skill: "frontend-design:frontend-design"` when:
- Building new pages or components
- Creating landing pages, dashboards, forms
- When design quality matters

## Testing & Development

### Test Authentication
For development, enable test auth bypass in `.env.local`:
```
NEXT_PUBLIC_ENABLE_TEST_AUTH=true
```

This adds a "Test Login" button that bypasses Clerk auth.
See `.claude/rules/testing-auth.md` for implementation details.

**NEVER enable in production!**

### Playwright Testing
Run UI tests with:
```bash
pnpm test:e2e
```

Use Playwright MCP to interactively test flows during development.
