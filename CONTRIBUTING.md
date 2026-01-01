# Contributing to Verified.Doctor

First off, thank you for considering contributing to Verified.Doctor! It's people like you that make this platform valuable for the medical community.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Style Guide](#style-guide)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our commitment to creating a welcoming and inclusive environment. By participating, you are expected to uphold this standard. Please report unacceptable behavior to [hello@verified.doctor](mailto:hello@verified.doctor).

## Getting Started

### Types of Contributions

There are many ways to contribute:

- **Bug Reports**: Found something broken? Open an issue!
- **Feature Requests**: Have an idea? We'd love to hear it!
- **Code Contributions**: Ready to code? Pick an issue and submit a PR!
- **Documentation**: Help improve our docs, README, or code comments
- **Design**: UI/UX improvements are always welcome
- **Testing**: Help us improve test coverage

### First Time Contributors

Look for issues labeled `good first issue` — these are specifically curated for newcomers.

## Development Setup

### Prerequisites

- Node.js 18+
- pnpm 8+
- Git
- A Supabase account (free tier works)

### Local Setup

1. **Fork the repository**

   Click the "Fork" button on GitHub to create your own copy.

2. **Clone your fork**

   ```bash
   git clone https://github.com/YOUR_USERNAME/verified-doctor.git
   cd verified-doctor
   ```

3. **Install dependencies**

   ```bash
   pnpm install
   ```

4. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Fill in the required values (see `.env.example` for details).

5. **Start the development server**

   ```bash
   pnpm dev
   ```

6. **Open the app**

   Navigate to [http://localhost:3000](http://localhost:3000)

## Making Changes

### Branch Naming

Use descriptive branch names:

- `feature/add-sms-notifications`
- `fix/handle-validation-error`
- `docs/update-readme`
- `refactor/simplify-auth-flow`

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, semicolons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(profile): add QR code download button
fix(auth): handle expired session gracefully
docs(readme): add deployment instructions
```

## Pull Request Process

1. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**

   Write code, add tests, update documentation.

3. **Test your changes**

   ```bash
   pnpm lint        # Check for linting errors
   pnpm build       # Ensure it builds
   ```

4. **Commit your changes**

   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

5. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request**

   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template

### PR Requirements

- [ ] Code follows the project's style guide
- [ ] All tests pass
- [ ] Documentation is updated (if applicable)
- [ ] PR description clearly explains the changes
- [ ] Linked to relevant issue (if applicable)

## Style Guide

### TypeScript

- Use TypeScript strict mode
- Prefer `interface` over `type` for object shapes
- Use explicit return types for functions
- Avoid `any` — use `unknown` if type is truly unknown

### React

- Use functional components with hooks
- Keep components small and focused
- Co-locate component-specific types
- Use shadcn/ui components as base

### CSS/Tailwind

- Use Tailwind utility classes
- Follow the design system in `docs/design-system.md`
- Mobile-first approach
- Use CSS variables for theme colors

### File Naming

- Components: `PascalCase.tsx`
- Utilities: `kebab-case.ts`
- Hooks: `use-hook-name.ts`
- Types: `types.ts` or co-located

### Project Structure

```
src/
├── app/           # Next.js routes
├── components/    # React components
│   ├── ui/       # shadcn/ui components
│   └── ...       # Feature components
├── lib/          # Utilities and helpers
├── hooks/        # Custom React hooks
└── types/        # TypeScript types
```

## Community

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and ideas
- **Twitter**: [@verifieddoctor](https://twitter.com/verifieddoctor)

---

Thank you for contributing! Your efforts help make healthcare more accessible and trustworthy.
