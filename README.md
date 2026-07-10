# BoatNow - Urban Water Mobility Platform

A satirical yet fully-functional boat booking platform for navigating Indian cities during monsoon floods. BoatNow enables users to book boats by the hour, discover captains via an interactive map, and access emergency water-based transportation when traditional roads become impassable.

## Features Implemented

### 1. Book Boats by the Hour
- Browse 5+ boat types (canoe, motorboat, kayak, shikara, raft) with real-time availability
- Select date, time, and duration for bookings
- Dynamic pricing based on puddle depth (surge pricing during high flood severity)
- One-click SOS emergency dispatch for immediate assistance

### 2. Location-Based Boat Discovery
- Interactive Leaflet-based map showing Delhi NCR geography
- Real-time captain/boat position markers with distance calculations
- Flooded landmark indicators (Connaught Place Basin, Noida Logway, Cyber City)
- Click-to-relocate rescue beacon feature
- Visual route tracking between customer and dispatched captain

### 3. Interactive Map View
- Full-featured Leaflet map integration with custom boat/user icons
- Theme-aware tiles (light/dark mode support)
- Live dispatch tracking with ETA countdown
- Landmark-based navigation zones
- Customizable coordinates grid system (0-100)

### 4. Real-Time Boat Availability
- Calendar-based date blocking for maintenance
- Live booking status tracking (pending, confirmed, completed, cancelled, rejected)
- Double-booking prevention
- Captain ETA estimation

### 5. Captain Ratings & Reviews
- 5-star rating system with multi-dimensional scores (cleanliness, punctuality, safety, overall)
- Written review submissions
- Captain profile pages with avatar, experience, and statistics

### 6. Secure Booking Flow (Mock Payment)
- Stripe checkout UI integration
- Mock payment processing with transaction references
- Payment logs and audit trail
- Refund tracking for cancelled bookings

### 7. Mobile-First Responsive Design
- Fully responsive across all viewports (375px - 1920px+)
- Mobile hamburger navigation menu
- Touch-friendly interface elements
- Optimized layouts for small screens

### 8. Dynamic Flood Severity Indicator
- Interactive puddle depth simulator (0-12 feet)
- Three severity levels with dynamic pricing adjustment
- Real-time advisory messages
- "Cloudburst" simulation for extreme weather testing

### 9. User Authentication & Profiles
- Three user roles: Customer, Owner, Admin
- Sandbox account switching for testing
- User profile management with contact info
- Role-based dashboard switching

### 10. Booking History & Ledger
- Complete booking records with status tracking
- Payment records linked to bookings
- Booking review prompts for completed trips
- Achievement badges system

### 11. Emergency SOS Boat Mode
- One-click emergency dispatch button
- Auto-selection of closest available boat
- Immediate payment processing
- Priority notification to captains
- Real-time GPS tracking

### 12. Additional Features
- **Notifications**: Real-time system alerts and booking updates
- **Advanced Filtering**: Multi-parameter search and filters
- **Dark/Light Theme**: Full UI theme switching with persistence
- **Admin Controls**: Boat suspension and system monitoring
- **Weather Integration**: IMD-style rain alert banners

## Tech Stack

- **React 19** with TypeScript
- **Tailwind CSS 4.1** for styling
- **Leaflet 1.9** for interactive maps
- **Lucide React** for icons
- **Vite 6.2** for building
- **Context API** for state management
- **localStorage** for data persistence

## Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open your browser:
   ```
   http://localhost:3000
   ```

## Build for Production

```bash
npm run build
npm run preview
```

## Type Checking

```bash
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── Header.tsx              # Navigation and auth
│   ├── MapContainer.tsx        # Leaflet map
│   ├── Filters.tsx             # Search filters
│   ├── RainAlertBanner.tsx
│   ├── ScrollWaterLevel.tsx    # Puddle depth gauge
│   └── StripeCheckout.tsx
├── pages/
│   ├── CustomerDashboard.tsx   # Main booking interface
│   ├── OwnerDashboard.tsx      # Fleet management
│   └── AdminDashboard.tsx      # System administration
├── context/
│   └── AppContext.tsx          # Global state & business logic
├── types.ts                    # TypeScript type definitions
├── data.ts                     # Initial seeds & constants
└── main.tsx
```

## Default Test Accounts

| Name | Email | Role |
|------|-------|------|
| Aaditya Malhotra | malhotraaaditya1.m@gmail.com | Customer |
| Captain Verma | verma@boatnow.com | Owner |
| Captain Singh | singh@boatnow.com | Owner |
| Super Admin | admin@boatnow.com | Admin |

## Key User Flows

### Customer Flow
1. Browse available boats in catalog
2. Click boat card to view details
3. Select date, time, duration, and life jacket preference
4. Proceed to Stripe checkout
5. View booking confirmation
6. Track captain arrival on interactive map
7. Leave star rating and review after trip

### Owner Flow
1. Switch to "Owner" role
2. View all registered boats and bookings
3. Accept/reject incoming charter requests
4. Block dates for maintenance
5. Monitor captain performance metrics

### Admin Flow
1. Switch to "Admin" role
2. Monitor all system activity
3. Suspend boats for safety violations
4. Adjust flood severity levels
5. View audit logs

## Features in Detail

### Dynamic Pricing
- Base price: `₹(boat.pricePerHour × hours)`
- Severity modifier:
  - Dry: 0.8x (20% discount)
  - Ankle-deep: 1.0x (standard)
  - Boat-recommended: 1.2x (20% surge)

### Map System
- 100x100 grid coordinates mapped to Delhi NCR bounds
- Custom Leaflet markers for boats and user beacon
- Real-time coordinate tracking during dispatch
- Visual polyline routes between points

### Achievement Badges
- **Puddle Pioneer**: Book 1 boat
- **Monsoon Veteran**: Book during high flood severity
- **Frequent Floater**: Complete 3+ bookings
- **Duck Approved**: Leave a review
- **Puddle Survivor**: Trigger SOS mode

## Deployment Options

- **Vercel** (recommended): `vercel deploy`
- **Netlify**: Drag-and-drop `dist/` folder
- **Docker**: Build with Node 18 base image
- **Traditional**: Serve `dist/` with Express/nginx

## Performance Notes

- Boat list renders efficiently even with 50+ entries
- Leaflet map optimized for smooth interactions
- localStorage caching reduces reload times
- Component memoization prevents unnecessary re-renders
- Images are lazy-loaded and optimized

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: iOS 12+, Android Chrome

## Accessibility

- Semantic HTML structure
- ARIA labels on all buttons and inputs
- Keyboard navigation support
- Color contrast ratios meet WCAG AA standards
- Screen reader friendly feedback

## Notes on Satire

This platform humorously addresses monsoon flooding in Indian cities through an absurdist lens. Elements include submarine-grade raft descriptions, samosa warmer amenities, and achievements like "Duck Approved." Despite the satirical tone, all functionality is production-quality and demonstrates professional web development practices.

## Status

✅ All 12 requested features implemented and tested
✅ Mobile responsiveness verified
✅ Map integration working
✅ Payment flow integrated
✅ Role-based dashboards complete
✅ Real-time notifications active
✅ Dark/light theme toggle working

**Last Updated**: July 2026
**Dev Server**: Running on `http://localhost:3000`
