# Google Places API Setup

## Why Switch to Google Places API?

Google Places API provides:
- ✅ **Much larger database** - Over 200 million places worldwide
- ✅ **Better coverage** - Especially for Asian cities like Hong Kong
- ✅ **More accurate results** - Constantly updated by Google users
- ✅ **Better category support** - More detailed place types
- ✅ **Reliable service** - Google's infrastructure

## Setup Instructions

### 1. Get Google Places API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable **Places API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Places API"
   - Click "Enable"

4. Create API Key:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy your API key

5. **Important**: Restrict your API key:
   - Click on your API key
   - Under "API restrictions", select "Restrict key"
   - Choose "Places API" only
   - Under "Application restrictions", add your domain (for production)

### 2. Add to Environment Variables

Add to `.env.local`:
```bash
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY=your_api_key_here
```

Add to Vercel:
- Go to Project Settings → Environment Variables
- Add `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY`
- Set value to your API key

### 3. Pricing

**Free Tier**: 
- $200 free credit per month
- Text Search: $32 per 1,000 requests
- Nearby Search: $32 per 1,000 requests
- Geocoding: $5 per 1,000 requests

**Estimated Monthly Cost** (for MVP):
- ~1,000 searches/month = ~$32/month
- Well within free tier ($200 credit)

### 4. How It Works

The app now:
1. **First tries Google Places API** (better results)
2. **Falls back to Geoapify** if Google fails (backup)

This ensures:
- Best possible results when Google is available
- Still works if Google API key is missing
- Graceful degradation

## Testing

After adding your API key, test with:
- Hong Kong, China
- Tokyo, Japan
- Bangkok, Thailand

You should see many more attractions than with Geoapify alone!
