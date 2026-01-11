# LevarTrip – AI Trip Planner

An AI-powered trip planning application with Trip.com affiliate integration.

## Tech Stack

- **Frontend**: Next.js 14 (React), TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Deployment**: Vercel
- **APIs**: Geoapify Places, OSRM, Claude AI, Open-Meteo, Mapbox

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill in your API keys:
```bash
cp .env.example .env.local
```

3. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL migrations in `supabase/migrations/`
   - Copy your Supabase URL and keys to `.env.local`

4. Run the development server:
```bash
npm run dev
```

## Environment Variables

See `.env.example` for all required environment variables.

## Project Structure

- `/app` - Next.js app router pages and layouts
- `/components` - React components
- `/lib` - Utility functions and API integrations
- `/types` - TypeScript type definitions
- `/supabase` - Database migrations and types
