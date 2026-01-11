# Switching to professorcathk-art Repository

## Current Status
- ✅ Remote URL updated to: `https://github.com/professorcathk-art/levart.git`
- ❌ Push failed: Token belongs to `mickeyfinance` account, can't push to `professorcathk-art`

## Solution: Get Token from professorcathk-art Account

You need a GitHub Personal Access Token from the **professorcathk-art** account.

### Step 1: Generate Token from professorcathk-art Account

1. **Log in to GitHub as professorcathk-art:**
   - Go to: https://github.com/login
   - Sign in with your **professorcathk-art** account

2. **Generate Token:**
   - Go to: https://github.com/settings/tokens
   - Click **"Generate new token"** → **"Generate new token (classic)"**
   - Name: `levart-project`
   - Expiration: 90 days (or your preference)
   - Scopes: Check **`repo`** (Full control of private repositories)
   - Click **"Generate token"**
   - **COPY THE TOKEN** (starts with `ghp_`)

### Step 2: Push Using New Token

Once you have the token, run:

```bash
cd /Users/mickeylau/levart
git push https://YOUR_PROFESSORCATHK_TOKEN@github.com/professorcathk-art/levart.git main
```

Replace `YOUR_PROFESSORCATHK_TOKEN` with your actual token from professorcathk-art account.

### Step 3: Verify Push

After pushing, check: https://github.com/professorcathk-art/levart

You should see all your code!

## Alternative: Use SSH (If Available)

If you have SSH keys set up for professorcathk-art:

```bash
git remote set-url origin git@github.com:professorcathk-art/levart.git
git push -u origin main
```

## After Successful Push

1. **Deploy to Vercel:**
   - Go to: https://vercel.com
   - Click "Add New Project"
   - You should now see `professorcathk-art/levart` in the list
   - Import it

2. **Add Environment Variables:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://zaqqhwognrmpcnskdtih.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_10pjfghSyS8LYf9xQkASCA_BRI3vCLu
   SUPABASE_SERVICE_ROLE_KEY=sb_secret_C-wLk4MEA55RJL_E760A4w_IjKs9M5Q
   AIML_API_KEY=d193202e84d444739a319e54e39dc770
   NEXT_PUBLIC_GEOAPIFY_API_KEY=72d90e77b939424f97db425563bc4253
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoibGV2YXJ0IiwiYSI6ImNtazk2N25tNTFka2MzZXFzeWl4Zm5mbTEifQ.jWF90XMcJBjgjZDEE7nNvA
   TRIP_COM_AFFILIATE_ID=
   ```

3. **Deploy!**

## Current Remote Status

✅ Remote is correctly set to: `https://github.com/professorcathk-art/levart.git`

Just need the correct token to push!
