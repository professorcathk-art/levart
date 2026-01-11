# Vercel Deployment - GitHub Account Issue

## The Problem
Vercel is showing `professorcathk-art` as the Git Scope, but your repository is under `mickeyfinance` account.

## Solutions

### Option 1: Switch Vercel to mickeyfinance Account (Recommended)

1. **Log out of current Vercel account:**
   - Go to Vercel Dashboard
   - Click your profile → Settings → Logout

2. **Log in with mickeyfinance GitHub account:**
   - Go to https://vercel.com/login
   - Click "Continue with GitHub"
   - Authorize with your **mickeyfinance** GitHub account
   - This will connect Vercel to the correct account

3. **Import project:**
   - Click "Add New Project"
   - You should now see `mickeyfinance/levart` in the list
   - Import it

### Option 2: Grant Access to professorcathk-art Account

If you want to keep using `professorcathk-art` account:

1. **Add collaborator:**
   - Go to: https://github.com/mickeyfinance/levart/settings/access
   - Click "Invite a collaborator"
   - Enter: `professorcathk-art`
   - Grant "Write" access
   - Accept the invitation

2. **Import in Vercel:**
   - Vercel should now be able to see the repository
   - Import `mickeyfinance/levart`

### Option 3: Transfer Repository (Not Recommended)

Transfer the repository from `mickeyfinance` to `professorcathk-art`:
- Go to repository Settings → Transfer ownership
- This is more complex and not recommended

## Recommended Approach

**Use Option 1** - Switch Vercel to use your `mickeyfinance` account. This is the cleanest solution since:
- ✅ Repository belongs to mickeyfinance
- ✅ All future projects under mickeyfinance will work
- ✅ No need to manage multiple accounts
- ✅ Cleaner setup

## After Switching Accounts

Once Vercel is connected to `mickeyfinance`:

1. **Import Project:**
   - Click "Add New Project"
   - Select "Import Git Repository"
   - Choose `mickeyfinance/levart`

2. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

3. **Add Environment Variables:**
   Add these in Vercel Dashboard → Project Settings → Environment Variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://zaqqhwognrmpcnskdtih.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_10pjfghSyS8LYf9xQkASCA_BRI3vCLu
   SUPABASE_SERVICE_ROLE_KEY=sb_secret_C-wLk4MEA55RJL_E760A4w_IjKs9M5Q
   AIML_API_KEY=d193202e84d444739a319e54e39dc770
   NEXT_PUBLIC_GEOAPIFY_API_KEY=72d90e77b939424f97db425563bc4253
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoibGV2YXJ0IiwiYSI6ImNtazk2N25tNTFka2MzZXFzeWl4Zm5mbTEifQ.jWF90XMcJBjgjZDEE7nNvA
   TRIP_COM_AFFILIATE_ID=
   ```

4. **Mark Sensitive Variables:**
   - Mark `SUPABASE_SERVICE_ROLE_KEY` as sensitive
   - Mark `AIML_API_KEY` as sensitive

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live!

## Verification

After deployment:
- ✅ Check deployment URL (e.g., `levart.vercel.app`)
- ✅ Test the full user flow
- ✅ Verify environment variables are loaded
- ✅ Check Vercel logs for any errors
