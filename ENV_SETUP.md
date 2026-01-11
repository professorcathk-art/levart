# Environment Variables Setup

Create a `.env.local` file in the root directory with the following content:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://zaqqhwognrmpcnskdtih.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_10pjfghSyS8LYf9xQkASCA_BRI3vCLu
SUPABASE_SERVICE_ROLE_KEY=sb_secret_C-wLk4MEA55RJL_E760A4w_IjKs9M5Q

# Geoapify Places API (get from https://www.geoapify.com/)
NEXT_PUBLIC_GEOAPIFY_API_KEY=

# Mapbox (get from https://www.mapbox.com/)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=

# AIML API (for Claude model) - get from https://aimlapi.com/
AIML_API_KEY=

# Trip.com Affiliate
TRIP_COM_AFFILIATE_ID=
```

## Required API Keys

You need to obtain the following API keys:

1. **Geoapify API Key** (Required)
   - Sign up at: https://www.geoapify.com/
   - Free tier: 3,000 requests/day
   - Used for: Finding attractions/POIs

2. **Mapbox Access Token** (Required)
   - Sign up at: https://www.mapbox.com/
   - Free tier: 50,000 map loads/month
   - Used for: Map visualization

3. **Anthropic API Key** (Required)
   - Sign up at: https://console.anthropic.com/
   - Requires credits in account
   - Used for: AI itinerary generation

4. **Trip.com Affiliate ID** (Optional for MVP)
   - Get from Trip.com affiliate program
   - Used for: Affiliate link tracking

## Supabase Setup

1. Go to your Supabase project: https://supabase.com/dashboard/project/zaqqhwognrmpcnskdtih
2. Navigate to SQL Editor
3. Run the migration file: `supabase/migrations/001_initial_schema.sql`
4. This creates the `users`, `itineraries`, and `affiliate_clicks` tables
