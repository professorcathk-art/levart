# Trip.com Affiliate Link Format Update

## ✅ Changes Made

### 1. Fixed TypeScript Error
- **File**: `lib/supabase/server.ts`
- **Issue**: Parameter `cookiesToSet` had implicit `any` type
- **Fix**: Added explicit type annotation: `Array<{ name: string; value: string; options?: unknown }>`

### 2. Updated Trip.com Affiliate Link Format

Based on your sample link:
```
https://www.trip.com/?Allianceid=7695682&SID=288370027&trip_sub1=levart&trip_sub3=D10111229
```

#### New Format Parameters:
- `Allianceid` - Your affiliate ID (7695682)
- `SID` - Session/Sub ID (288370027)
- `trip_sub1` - Project identifier (levart)
- `trip_sub3` - Optional tracking parameter (D10111229)

#### Updated Files:
1. **`lib/apis/trip-com.ts`**
   - Updated `generateHotelAffiliateLink()` to use new format
   - Updated `generateFlightAffiliateLink()` to use new format
   - Changed parameter from `affiliateId: string` to `affiliateConfig` object

2. **`app/api/affiliate/config/route.ts`**
   - Now returns full affiliate configuration:
     - `allianceId` (default: 7695682)
     - `sid` (default: 288370027)
     - `tripSub1` (default: 'levart')
     - `tripSub3` (optional, from env var)

3. **`components/itinerary-step.tsx`**
   - Updated to use `affiliateConfig` state instead of `affiliateId`
   - Updated link generation to use new format with all parameters

## 🔧 Environment Variables

Add these to your `.env.local` and Vercel:

```bash
# Trip.com Affiliate Configuration
TRIP_COM_ALLIANCE_ID=7695682
TRIP_COM_SID=288370027
TRIP_COM_SUB1=levart
TRIP_COM_SUB3=D10111229  # Optional
```

**Note**: Defaults are set in code, but you can override with env vars.

## 📋 Link Format Examples

### Hotel Link:
```
https://www.trip.com/hotels?city=Tokyo&checkIn=2024-01-15&checkOut=2024-01-20&Allianceid=7695682&SID=288370027&trip_sub1=levart&trip_sub3=D10111229
```

### Flight Link:
```
https://www.trip.com/flights?to=Tokyo&departureDate=2024-01-15&Allianceid=7695682&SID=288370027&trip_sub1=levart&trip_sub3=D10111229
```

## ✅ Benefits

1. **Proper Tracking**: Uses Trip.com's official affiliate tracking format
2. **Custom Parameters**: `trip_sub1` identifies your project (levart)
3. **Optional Tracking**: `trip_sub3` can be used for additional tracking
4. **Type Safety**: All parameters properly typed

## 🚀 Next Steps

1. **Add Environment Variables** to Vercel:
   - `TRIP_COM_ALLIANCE_ID=7695682`
   - `TRIP_COM_SID=288370027`
   - `TRIP_COM_SUB1=levart`
   - `TRIP_COM_SUB3=D10111229` (optional)

2. **Test Links**: After deployment, test that:
   - Links redirect correctly to Trip.com
   - Tracking parameters are preserved
   - Clicks are tracked in Trip.com dashboard

3. **Customize `trip_sub3`**: You can make this dynamic (e.g., per itinerary ID) if needed for better tracking.

## 📝 Notes

- All links now use the correct Trip.com affiliate format
- Backward compatible (falls back to non-affiliate links if config missing)
- TypeScript errors fixed
- Ready for production deployment
