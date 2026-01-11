# LevarTrip - Project Summary

## Overview
LevarTrip is an AI-powered trip planning application that generates personalized itineraries and integrates with Trip.com for hotel and flight bookings.

## Architecture

### Frontend
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Components**: React Server Components with minimal client components

### Backend
- **Database**: Supabase (PostgreSQL)
- **APIs**: 
  - Geoapify Places API (attractions/POIs)
  - OSRM (route optimization)
  - Claude AI (itinerary generation)
  - Open-Meteo (weather forecasts)
  - Mapbox (map visualization)

### Key Features Implemented

1. **Multi-Step User Flow**
   - Step 1: Destination selection with trip focus and dates
   - Step 2: Attraction selection from fetched POIs
   - Step 3: AI-generated itinerary display with map

2. **API Integrations**
   - `/api/attractions` - Fetches attractions based on destination and focus
   - `/api/route/optimize` - Optimizes route between selected attractions
   - `/api/itinerary/generate` - Generates full AI itinerary
   - `/api/itinerary/save` - Saves itinerary to Supabase
   - `/api/affiliate/click` - Logs affiliate link clicks
   - `/api/affiliate/config` - Returns affiliate ID configuration
   - `/api/mapbox/config` - Returns Mapbox token

3. **Database Schema**
   - `users` - User accounts (supports anonymous users)
   - `itineraries` - Stores generated itineraries with all metadata
   - `affiliate_clicks` - Tracks affiliate link clicks for analytics

4. **Components**
   - `destination-step.tsx` - Destination and trip focus selection
   - `attractions-step.tsx` - Attraction selection with checkboxes
   - `itinerary-step.tsx` - Day-by-day itinerary display
   - `map-component.tsx` - Mapbox map with route visualization

## File Structure

```
levart/
├── app/
│   ├── api/              # API routes
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx         # Main page with step flow
├── components/           # React components
├── lib/
│   ├── apis/            # API integration utilities
│   └── supabase/       # Supabase client/server setup
├── supabase/
│   └── migrations/     # Database migrations
├── types/              # TypeScript type definitions
└── [config files]     # Next.js, TypeScript, Tailwind configs
```

## User Journey Flow

1. User enters destination, selects trip focus (multi-select), and dates
2. System fetches relevant attractions from Geoapify
3. User selects/deselects attractions to include
4. System optimizes route using OSRM
5. System fetches weather forecast
6. Claude AI generates day-by-day itinerary
7. Itinerary displayed with:
   - Day-by-day activities (morning/afternoon/evening)
   - Restaurant suggestions
   - Transport recommendations
   - Weather information
   - Cost estimates
   - Interactive map with route
8. User can click Trip.com affiliate links to book hotels/flights
9. All clicks are logged to Supabase for analytics

## Next Steps for Deployment

1. Set up Supabase project and run migrations
2. Configure all API keys in `.env.local`
3. Install dependencies: `npm install`
4. Run development server: `npm run dev`
5. Deploy to Vercel: Connect GitHub repo and configure environment variables

## Environment Variables Required

See `SETUP.md` for complete list. Key variables:
- Supabase URL and keys
- Geoapify API key
- Mapbox access token
- Anthropic API key (Claude)
- Trip.com affiliate ID

## Notes

- Anonymous users are supported (user_id can be null)
- All API calls include error handling and loading states
- Map component gracefully handles missing Mapbox token
- Itinerary is automatically saved to Supabase after generation
- Affiliate clicks are logged before redirecting to Trip.com
