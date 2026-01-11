# Trip.com Affiliate Integration Guide

## ✅ What's Already Implemented

1. **Affiliate Link Generation**
   - Hotel booking links with destination, dates, and affiliate ID
   - Flight booking links with origin, destination, dates, and affiliate ID
   - Located in: `lib/apis/trip-com.ts`

2. **Click Tracking**
   - All affiliate clicks are logged to Supabase `affiliate_clicks` table
   - Tracks: user_id, itinerary_id, click_type, destination, timestamp
   - API endpoint: `/api/affiliate/click`

3. **Affiliate ID Configuration**
   - Stored in environment variable: `TRIP_COM_AFFILIATE_ID`
   - Served to client via: `/api/affiliate/config`
   - Your ID: `7695682` ✅

## 🔧 What You Need to Know

### 1. Affiliate Link Format

Trip.com affiliate links typically use one of these formats:

**Option A: Query Parameter (Current Implementation)**
```
https://www.trip.com/hotels?city=Tokyo&checkIn=2024-01-15&checkOut=2024-01-20&affiliateId=7695682
```

**Option B: Subdomain/Path (Alternative)**
```
https://www.trip.com/hotels/Tokyo?checkIn=2024-01-15&checkOut=2024-01-20&affiliateId=7695682
```

**Option C: Tracking Parameter (Common)**
```
https://www.trip.com/hotels?city=Tokyo&checkIn=2024-01-15&checkOut=2024-01-20&aid=7695682
```

### 2. Required Parameters

**For Hotels:**
- ✅ `city` - Destination city name
- ✅ `checkIn` - Check-in date (YYYY-MM-DD)
- ✅ `checkOut` - Check-out date (YYYY-MM-DD)
- ✅ `affiliateId` - Your affiliate ID (7695682)

**Optional Parameters:**
- `adults` - Number of adults (default: 2)
- `rooms` - Number of rooms (default: 1)
- `children` - Number of children (default: 0)

**For Flights:**
- ✅ `to` - Destination city/code
- ✅ `departureDate` - Departure date (YYYY-MM-DD)
- ✅ `affiliateId` - Your affiliate ID (7695682)

**Optional Parameters:**
- `from` - Origin city/code (if not provided, user selects)
- `returnDate` - Return date for round trip
- `adults` - Number of adults
- `children` - Number of children
- `cabinClass` - Economy, Business, First

### 3. What Trip.com Requires

To ensure your affiliate links work correctly, verify with Trip.com:

1. **Affiliate Program Status**
   - Confirm your account (ID: 7695682) is active
   - Check if there are any approval requirements
   - Verify commission structure

2. **Link Format Verification**
   - Check Trip.com affiliate dashboard for preferred link format
   - Some programs use `aid=` instead of `affiliateId=`
   - Some use subdomain tracking (e.g., `affiliate.trip.com`)

3. **Tracking & Reporting**
   - Access Trip.com affiliate dashboard to see clicks/conversions
   - Our Supabase tracking is supplementary for your own analytics
   - Trip.com will track actual bookings and commissions

4. **Cookie Duration**
   - Check how long Trip.com cookies last (typically 30-90 days)
   - Users who click your link and book within that period earn you commission

## 🚀 Next Steps

### Step 1: Verify Link Format

Contact Trip.com affiliate support or check your affiliate dashboard to confirm:
- Preferred parameter name: `affiliateId` vs `aid` vs `ref`
- Required vs optional parameters
- Any special tracking requirements

### Step 2: Test Links

1. **Test Hotel Link:**
   ```
   https://www.trip.com/hotels?city=Tokyo&checkIn=2024-01-15&checkOut=2024-01-20&affiliateId=7695682
   ```

2. **Test Flight Link:**
   ```
   https://www.trip.com/flights?to=Tokyo&departureDate=2024-01-15&affiliateId=7695682
   ```

3. **Verify Tracking:**
   - Click the links
   - Complete a test booking (or just verify redirect works)
   - Check Trip.com affiliate dashboard for tracking

### Step 3: Enhance Implementation (Optional)

If Trip.com requires different parameters, update `lib/apis/trip-com.ts`:

```typescript
// Example: If Trip.com uses 'aid' instead of 'affiliateId'
params.append('aid', affiliateId)

// Example: If Trip.com requires subdomain
const baseUrl = 'https://affiliate.trip.com/hotels'
```

### Step 4: Add Origin City for Flights (Enhancement)

Currently, flight links don't include origin. You might want to add:

1. **Add origin input in destination step:**
   ```typescript
   const [origin, setOrigin] = useState('')
   ```

2. **Update flight link:**
   ```typescript
   href={`https://www.trip.com/flights?from=${origin}&to=${destination}&departureDate=${checkIn}&affiliateId=${affiliateId}`}
   ```

## 📊 Analytics & Tracking

### What We Track (Supabase)
- Click timestamp
- Click type (hotel/flight/activity)
- Destination
- User ID (if logged in)
- Itinerary ID

### What Trip.com Tracks
- Actual bookings
- Commission earned
- Conversion rates
- Revenue

## ✅ Current Status

- ✅ Affiliate ID configured: `7695682`
- ✅ Links generated with affiliate ID
- ✅ Click tracking implemented
- ✅ Environment variable set
- ⚠️ Need to verify link format with Trip.com
- ⚠️ Optional: Add origin city for flights
- ⚠️ Optional: Add guest/room parameters for hotels

## 🔗 Resources

- Trip.com Affiliate Dashboard: Check your affiliate account
- Trip.com Support: Contact for link format verification
- Your Affiliate ID: `7695682`

## Summary

Your affiliate integration is **ready to use**! The main thing to verify is:
1. **Link format** - Confirm Trip.com accepts `affiliateId` parameter
2. **Tracking** - Test that clicks are tracked in Trip.com dashboard
3. **Optional enhancements** - Add origin city, guest counts, etc.

The code will automatically include your affiliate ID (`7695682`) in all booking links!
