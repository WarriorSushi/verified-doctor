# Security Policy

## Reporting a Vulnerability

We take security seriously at Verified.Doctor. If you discover a security vulnerability, please report it responsibly.

### How to Report

**DO NOT** open a public GitHub issue for security vulnerabilities.

Instead, please email us at: **security@verified.doctor**

Include the following information:

1. **Description** of the vulnerability
2. **Steps to reproduce** the issue
3. **Potential impact** of the vulnerability
4. **Suggested fix** (if you have one)

### What to Expect

- **Acknowledgment**: We will acknowledge your report within 48 hours
- **Assessment**: We will assess the vulnerability within 7 days
- **Resolution**: Critical issues will be patched within 30 days
- **Credit**: We will credit you in our security acknowledgments (unless you prefer to remain anonymous)

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Security Best Practices

### For Contributors

- Never commit secrets, API keys, or credentials
- Use environment variables for sensitive configuration
- Validate all user input (we use Zod for validation)
- Use parameterized queries (Supabase handles this)
- Follow the principle of least privilege

### For Users

- Use strong, unique passwords
- Keep your environment variables secure
- Regularly rotate API keys
- Monitor your Supabase dashboard for unusual activity

## Known Security Measures

### Authentication
- Supabase Auth with secure session management
- JWT-based admin authentication
- Protected API routes with middleware

### Data Protection
- Row Level Security (RLS) on all tables
- Input validation with Zod schemas
- SQL injection prevention via Supabase client
- XSS prevention via React's default escaping

### Rate Limiting
- API rate limiting with Upstash Redis
- Per-IP throttling on public endpoints
- Recommendation spam prevention

### File Upload Security
- Client-side image compression
- File type validation
- Private storage buckets for sensitive documents

## Security Acknowledgments

We thank the following individuals for responsibly disclosing security issues:

*No security issues have been reported yet.*

---

Thank you for helping keep Verified.Doctor secure!
