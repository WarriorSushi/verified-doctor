# Verified.Doctor Analytics System

## Overview

The Verified.Doctor analytics system tracks all user interactions on public doctor profiles, providing detailed insights to doctors via their dashboard. This system supports the platform's monetization strategy by offering enhanced analytics as part of the Pro plan.

---

## What's Tracked

### Event Types

| Event Type | Trigger | Data Captured |
|------------|---------|---------------|
| `profile_view` | Profile page load | visitor_id, device, referrer, is_verified_viewer |
| `click_save_contact` | Save Contact button clicked | visitor_id, device |
| `click_book_appointment` | Book Appointment button clicked | visitor_id, device |
| `click_send_inquiry` | Send Inquiry button clicked | visitor_id, device |
| `click_recommend` | Recommend button clicked | visitor_id, device |
| `inquiry_sent` | Inquiry form successfully submitted | visitor_id |
| `recommendation_given` | Recommendation confirmed | visitor_id |

### Visitor Identification

- **Visitor ID**: Browser fingerprint hash based on user agent, language, and screen size
- **Session ID**: Persists in sessionStorage for the browser session
- **IP Address**: Captured from request headers (x-forwarded-for, x-real-ip)

### Device Detection

Automatic detection based on user agent:
- Mobile
- Tablet
- Desktop

---

## Database Schema

### `analytics_events` Table

Stores raw event data for detailed analysis.

```sql
- id: UUID (primary key)
- profile_id: UUID (references profiles)
- event_type: TEXT
- visitor_id: TEXT
- visitor_ip: TEXT
- viewer_profile_id: UUID (if viewer is a verified doctor)
- is_verified_viewer: BOOLEAN
- referrer: TEXT
- user_agent: TEXT
- device_type: TEXT (mobile, tablet, desktop)
- session_id: TEXT
- created_at: TIMESTAMPTZ
```

### `analytics_daily_stats` Table

Aggregated daily statistics for fast dashboard queries.

```sql
- id: UUID (primary key)
- profile_id: UUID (references profiles)
- date: DATE
- total_views: INTEGER
- unique_views: INTEGER
- verified_doctor_views: INTEGER
- click_save_contact: INTEGER
- click_book_appointment: INTEGER
- click_send_inquiry: INTEGER
- click_recommend: INTEGER
- inquiries_received: INTEGER
- recommendations_received: INTEGER
- mobile_views: INTEGER
- tablet_views: INTEGER
- desktop_views: INTEGER
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

---

## API Endpoints

### Track Event

```
POST /api/analytics/track
```

**Request Body:**
```json
{
  "profileId": "uuid",
  "eventType": "profile_view",
  "viewerProfileId": "uuid (optional)",
  "isVerifiedViewer": false,
  "sessionId": "string (optional)",
  "visitorId": "string (optional)",
  "deviceType": "mobile|tablet|desktop (optional)",
  "referrer": "string (optional)"
}
```

**Response:**
```json
{ "success": true }
```

Note: This endpoint always returns success to avoid breaking the client. Errors are logged server-side.

### Get Dashboard Analytics

```
GET /api/analytics/dashboard?days=30
```

**Query Parameters:**
- `days`: Number of days to include (7, 30, 90, 365)

**Response:**
```json
{
  "profileId": "uuid",
  "dateRange": {
    "start": "2024-01-01",
    "end": "2024-01-31",
    "days": 30
  },
  "totals": {
    "totalViews": 1205,
    "uniqueViews": 890,
    "verifiedDoctorViews": 45,
    "clickSaveContact": 234,
    "clickBookAppointment": 156,
    "clickSendInquiry": 89,
    "clickRecommend": 67,
    "inquiriesReceived": 72,
    "recommendationsReceived": 52,
    "mobileViews": 600,
    "tabletViews": 105,
    "desktopViews": 500
  },
  "changes": {
    "totalViews": 12,
    "uniqueViews": 8,
    "verifiedDoctorViews": -5
  },
  "dailyStats": [...],
  "deviceBreakdown": {
    "mobile": 600,
    "tablet": 105,
    "desktop": 500
  },
  "actionsBreakdown": {
    "saveContact": 234,
    "bookAppointment": 156,
    "sendInquiry": 89,
    "recommend": 67
  },
  "topReferrers": [
    { "referrer": "google.com", "count": 450 },
    { "referrer": "direct", "count": 320 }
  ]
}
```

---

## Dashboard Features

### Overview Cards

- **Total Views**: All profile views with % change vs previous period
- **Unique Visitors**: Distinct visitor fingerprints
- **Doctor Views**: Views from verified doctors on the platform
- **Total Actions**: Sum of all button clicks

### Charts

1. **Views Over Time**: Area chart showing daily views, unique visitors, and doctor views
2. **Actions Breakdown**: Horizontal bar chart of action types
3. **Device Breakdown**: Pie chart of mobile/tablet/desktop

### Time Period Selector

- Last 7 days
- Last 30 days
- Last 90 days
- Last year

---

## Admin Features

### User Management

**List All Users**: `/admin/users`
- Search by name, handle, or specialty
- Paginated results (20 per page)
- Shows verification status, stats, join date

**User Detail**: `/admin/users/[id]`
- Full profile information
- 30-day analytics summary
- Document verification status
- Send admin message capability

### Admin Messaging

Admin can send messages to any user that:
- Appear with reddish-pink styling
- Are automatically pinned to top of inbox
- Show "Verified.Doctor Team" as sender
- Have an "Admin" badge

**API Endpoint:**
```
POST /api/admin/messages
{
  "profileId": "uuid",
  "message": "Your message here"
}
```

---

## User Message Features

### Delete Messages

Users can soft-delete messages from their inbox:
- Delete button appears on hover
- Confirmation dialog before deletion
- Messages are soft-deleted (deleted_at timestamp)
- Deleted messages don't appear in inbox

---

## Client-Side Implementation

### Tracking Library

Located at `src/lib/analytics.ts`:

```typescript
import { trackEvent } from "@/lib/analytics";

// Track a simple event
trackEvent({
  profileId: "uuid",
  eventType: "click_save_contact"
});

// Track with viewer info (for verified doctors)
trackEvent({
  profileId: "uuid",
  eventType: "profile_view",
  viewerProfileId: "viewer-uuid",
  isVerifiedViewer: true
});
```

### Helper Functions

- `generateVisitorId()`: Creates browser fingerprint
- `getSessionId()`: Gets/creates session ID from sessionStorage
- `detectDeviceType()`: Returns "mobile", "tablet", or "desktop"
- `getReferrer()`: Returns document.referrer or "direct"

### ProfileViewTracker Component

```tsx
import { ProfileViewTracker } from "@/components/profile/profile-view-tracker";

// In profile template:
<ProfileViewTracker profileId={profile.id} />
```

---

## Monetization Tiers

### Free Tier

- Basic view count on dashboard overview
- No detailed analytics

### Pro Tier (Future)

- Full analytics dashboard with all charts
- View tracking for verified doctor visits
- Click tracking for all buttons
- Referrer data
- Device breakdown
- Export data as CSV
- Historical data beyond 30 days

---

## Technical Notes

### Performance

- Raw events are stored in `analytics_events` for detailed queries
- Daily aggregates in `analytics_daily_stats` for fast dashboard loads
- Database trigger auto-updates daily stats when events are inserted

### Privacy

- No PII stored beyond IP address (already captured elsewhere)
- Visitor fingerprinting uses only technical browser data
- No cookies required for analytics

### Security

- Rate limiting on track endpoint (via existing Upstash setup)
- Profile ID validation before tracking
- Admin routes protected by session verification

---

## Files Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analytics/
│   │   │   ├── track/route.ts        # Track events
│   │   │   └── dashboard/route.ts    # Get analytics
│   │   └── admin/
│   │       ├── users/
│   │       │   ├── route.ts          # List users
│   │       │   └── [id]/route.ts     # User detail
│   │       └── messages/route.ts     # Admin send message
│   ├── (dashboard)/
│   │   └── dashboard/
│   │       └── analytics/page.tsx    # Analytics dashboard
│   └── admin/
│       └── users/
│           ├── page.tsx              # All users list
│           └── [id]/page.tsx         # User detail + messaging
├── components/
│   ├── analytics/
│   │   ├── analytics-overview.tsx    # Overview metric cards
│   │   ├── views-chart.tsx           # Area chart
│   │   ├── actions-chart.tsx         # Bar chart
│   │   ├── device-chart.tsx          # Pie chart
│   │   └── referrers-table.tsx       # Top referrers
│   └── profile/
│       └── profile-view-tracker.tsx  # Client-side view tracking
└── lib/
    └── analytics.ts                  # Client analytics utilities
```
