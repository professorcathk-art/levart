# Deployment Checklist & Health Check

## ✅ Code Health Check

All syntax checks passed:
- ✅ TypeScript compilation (strict mode enabled)
- ✅ ESLint checks passed
- ✅ All API routes properly structured
- ✅ Environment variables properly accessed
- ✅ Type safety maintained throughout

## 📋 Pre-Deployment Steps

### 1. Create `.env.local` File

Create `.env.local` in the root directory with:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://zaqqhwognrmpcnskdtih.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_10pjfghSyS8LYf9xQkASCA_BRI3vCLu
SUPABASE_SERVICE_ROLE_KEY=sb_secret_C-wLk4MEA55RJL_E760A4w_IjKs9M5Q

# Geoapify Places API
NEXT_PUBLIC_GEOAPIFY_API_KEY=your_geoapify_key_here

# Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here

# AIML API (for Claude model)
AIML_API_KEY=your_aiml_api_key_here

# Trip.com Affiliate
TRIP_COM_AFFILIATE_ID=your_affiliate_id_here
```

### 2. Set Up Supabase Database

1. Go to: https://supabase.com/dashboard/project/zaqqhwognrmpcnskdtih
2. Navigate to **SQL Editor**
3. Copy and run the SQL from: `supabase/migrations/001_initial_schema.sql`
4. This creates:
   - `users` table
   - `itineraries` table  
   - `affiliate_clicks` table
   - All necessary indexes and RLS policies

### 3. Install Dependencies

```bash
npm install
```

### 4. Test Build Locally

```bash
npm run build
```

If build succeeds, you're ready for Vercel deployment.

## 🚀 Vercel Deployment

### Option 1: Via GitHub (Recommended)

1. **Push to GitHub** (requires authentication):
   ```bash
   git push -u origin main
   ```
   If you get authentication errors, use:
   - Personal Access Token, or
   - SSH keys, or
   - GitHub CLI: `gh auth login`

2. **Connect to Vercel**:
   - Go to https://vercel.com
   - Click "New Project"
   - Import from GitHub: `mickeyfinance/levart`
   - Configure environment variables (see below)
   - Deploy

### Option 2: Direct Deploy

```bash
npm install -g vercel
vercel
```

Follow prompts and add environment variables.

## 🔑 Required API Keys

### Priority 1: Essential APIs

1. **Geoapify API** ⭐ Required
   - Sign up: https://www.geoapify.com/
   - Free tier: 3,000 requests/day
   - Used for: Finding attractions/POIs
   - Get key from: Dashboard → API Keys

2. **AIML API Key** ⭐ Required
   - Sign up: https://aimlapi.com/
   - Used for: AI itinerary generation (Claude model)
   - Get key from: Dashboard → API Keys
   - Documentation: https://aimlapi.com/

3. **Mapbox Access Token** ⭐ Required
   - Sign up: https://www.mapbox.com/
   - Free tier: 50,000 map loads/month
   - Used for: Map visualization
   - Get token from: Account → Access Tokens

### Priority 2: Optional APIs

4. **Trip.com Affiliate ID** (Optional)
   - Get from: Trip.com affiliate program
   - Used for: Affiliate link tracking
   - Can be added later

## 🌐 Vercel Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://zaqqhwognrmpcnskdtih.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_10pjfghSyS8LYf9xQkASCA_BRI3vCLu
SUPABASE_SERVICE_ROLE_KEY=sb_secret_C-wLk4MEA55RJL_E760A4w_IjKs9M5Q
NEXT_PUBLIC_GEOAPIFY_API_KEY=<your_key>
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=<your_token>
AIML_API_KEY=<your_key>
TRIP_COM_AFFILIATE_ID=<your_id>
```

**Important**: Mark `SUPABASE_SERVICE_ROLE_KEY` and `AIML_API_KEY` as **sensitive** (don't expose to client).

## ✅ Post-Deployment Verification

After deployment, test:

1. ✅ Homepage loads
2. ✅ Destination step works
3. ✅ Attractions fetch (requires Geoapify key)
4. ✅ Route optimization (OSRM - no key needed)
5. ✅ Weather fetch (Open-Meteo - no key needed)
6. ✅ Itinerary generation (requires AIML API key)
7. ✅ Map display (requires Mapbox token)
8. ✅ Database saves (requires Supabase setup)

## 🐛 Troubleshooting

### Build Fails
- Check all environment variables are set
- Verify TypeScript compilation: `npm run build`
- Check Vercel build logs

### API Errors
- Verify API keys are correct
- Check API rate limits
- Review browser console for client-side errors
- Check Vercel function logs for server-side errors

### Database Errors
- Verify Supabase migration ran successfully
- Check RLS policies allow operations
- Verify Supabase URL and keys are correct

## 📝 Next Steps After Deployment

1. Get API keys (see Priority 1 above)
2. Test full user flow end-to-end
3. Monitor Vercel function logs
4. Check Supabase dashboard for saved data
5. Test affiliate click tracking
