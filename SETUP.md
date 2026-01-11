# Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Geoapify Places API
NEXT_PUBLIC_GEOAPIFY_API_KEY=your_geoapify_api_key

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token

# Claude AI (Anthropic)
ANTHROPIC_API_KEY=your_anthropic_api_key

# Trip.com Affiliate
TRIP_COM_AFFILIATE_ID=your_trip_com_affiliate_id
```

## Database Setup

1. Create a Supabase project at https://supabase.com
2. Run the SQL migration in `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor
3. Copy your Supabase URL and keys to `.env.local`

## API Keys

### Geoapify
- Sign up at https://www.geoapify.com/
- Get your API key from the dashboard
- Free tier includes 3000 requests/day

### Mapbox
- Sign up at https://www.mapbox.com/
- Get your access token from the account page
- Free tier includes 50,000 map loads/month

### AIML API (Claude)
- Sign up at https://aimlapi.com/
- Get your API key from the dashboard
- Documentation: https://aimlapi.com/

### Open-Meteo
- No API key required
- Free to use

### OSRM
- No API key required
- Public instance used

## Installation

```bash
npm install
npm run dev
```

Visit http://localhost:3000
