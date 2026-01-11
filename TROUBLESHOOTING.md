# Troubleshooting Guide

## Common Errors and Solutions

### Error: "Failed to generate itinerary"

This error can have several causes:

#### 1. AIML API Key Missing or Invalid
**Symptom**: Error mentions "AIML_API_KEY is not configured"

**Solution**:
- Check Vercel Environment Variables
- Add `AIML_API_KEY` with value: `d193202e84d444739a319e54e39dc770`
- Redeploy the application

#### 2. Route Optimization Failed
**Symptom**: Error mentions "OSRM routing failed" or "At least 2 points required"

**Solution**:
- Make sure you selected at least 2 attractions
- The app will now use default route values if optimization fails

#### 3. Weather API Failed
**Symptom**: Error mentions "Open-Meteo API error"

**Solution**:
- Weather API is free and usually works
- The app will now use default weather forecasts if API fails

#### 4. Claude API Invalid Response
**Symptom**: Error mentions "Invalid JSON response from Claude"

**Solution**:
- Check AIML API key is valid
- Check AIML API dashboard for usage/quota
- The API might be rate-limited

#### 5. Missing Environment Variables
**Check all required env vars in Vercel**:
```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
AIML_API_KEY
NEXT_PUBLIC_GEOAPIFY_API_KEY
NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
```

### How to Debug

1. **Check Vercel Function Logs**:
   - Go to Vercel Dashboard → Your Project → Functions
   - Click on failed function
   - Check logs for detailed error messages

2. **Check Browser Console**:
   - Open browser DevTools (F12)
   - Check Console tab for errors
   - Check Network tab for failed API calls

3. **Check API Response**:
   - In Network tab, click on failed request
   - Check Response tab for error details

### Most Common Issue

**Missing AIML_API_KEY in Vercel**:
- The API key exists in `.env.local` but not in Vercel
- Add it to Vercel → Project Settings → Environment Variables
- Redeploy after adding
